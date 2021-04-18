import db from 'diskdb';
import { logEvent } from './logs';
import ALLOWED_DATA, { AllowedDataType } from '../../../config/allowedData';
import groupBy from '../helpers/groupBy';

export const addPrimalInstance = (
  request: {
    [k in AllowedDataType]: string;
  }
) => {
  if (!request.instanceID) {
    return 400;
  }

  const requestItems = Object.entries(request);

  if (db.instances.find({ instanceID: request.instanceID }).length < 1) {
    const data = {} as { createdAt: Date };
    requestItems.forEach((item) => {
      // if the request item key exists in the ALLOWED_DATA array, save it
      if (ALLOWED_DATA.includes(item[0] as AllowedDataType)) {
        data[item[0]] = item[1];
      }
      data.createdAt = new Date();
    });

    db.instances.save(data);
    logEvent({ event: 'Instance Created', payload: data });
    return 204;
  }
  return 409;
};

export const updateInstance = (
  request: {
    [k in AllowedDataType]: string;
  }
) => {
  if (!request.instanceID) {
    return 400;
  }

  const requestItems = Object.entries(request);
  const data = {};

  requestItems.forEach((item) => {
    // if the request item key exists in the ALLOWED_DATA array, save it
    if (ALLOWED_DATA.includes(item[0] as AllowedDataType)) {
      data[item[0]] = item[1];
    }
  });

  db.instances.update({ instanceID: request.instanceID }, data, {
    upsert: true,
  });

  logEvent({ event: 'Instance Update: Started', payload: data });
  return 204;
};

export const doneUpdatingInstance = (
  request: {
    [k in AllowedDataType]: string;
  }
) => {
  if (!request.instanceID) {
    return 400;
  }

  const requestItems = Object.entries(request);
  const data = {} as { instanceVersion: string; instanceID: string };
  let shouldCleardown = false;

  requestItems.forEach((item) => {
    // if the request item key exists in the ALLOWED_DATA array, save it
    if (ALLOWED_DATA.includes(item[0] as AllowedDataType)) {
      data[item[0]] = item[1];

      // if the instance reporting as done is the chosen one for this update
      // we should cleardown
      if (item[0] === 'instanceIsChosenOne' && item[1]) shouldCleardown = true;
    }
  });

  if (shouldCleardown && typeof data['stackName'] === 'string') {
    const currentStackInstances = db.instances.find({
      stackName: data['stackName'],
    });
    if (currentStackInstances.length > 0) {
      currentStackInstances.forEach((instance: any) => {
        if (
          instance.instanceID !== data.instanceID &&
          instance.instanceUpdatingToVersion !== data.instanceVersion
        ) {
          db.instances.remove({ instanceID: instance.instanceID }, true);
        }
      });
    }
  }

  db.instances.update({ instanceID: request.instanceID }, data, {
    upsert: true,
  });

  logEvent({ event: 'Instance Update: Done', payload: request.instanceID });
  return 204;
};

export const deleteInstance = (
  request: {
    [k in AllowedDataType]: string;
  }
) => {
  if (!request.instanceID) {
    return 400;
  }
  db.instances.remove({ instanceID: request.instanceID }, true);
  logEvent({ event: 'Instance Deleted', payload: request.instanceID });
  return 204;
};

export const getInstances = (urlParams: { [k: string]: string }) => {
  if (urlParams.groupBy) {
    const groupByValue = urlParams.groupBy;

    delete urlParams.groupBy;

    const stacks = db.instances.find(urlParams);

    return groupBy(stacks, (instance) => instance[groupByValue]);
  } else {
    return db.instances.find(urlParams);
  }
};
