import db from "diskdb";
import { logEvent } from "./logs";

export const addPrimalInstance = request => {
  if (!request.instanceID) {
    return 400;
  }

  const requestItems = Object.entries(request);

  if (db.instances.find({ instanceID: request.instanceID }).length < 1) {
    const data = {};
    requestItems.forEach(item => {
      // if the request item key exists in the ALLOWED_DATA array, save it
      if (process.env.ALLOWED_DATA.includes(item[0])) {
        data[item[0]] = item[1];
      }
      data.createdAt = new Date();
    });

    db.instances.save(data);
    logEvent({ event: "Making New Instance", payload: data });
    return 204;
  }
  return 409;
};

export const updateInstance = request => {
  if (!request.instanceID) {
    return 400;
  }

  const requestItems = Object.entries(request);
  const data = {};

  requestItems.forEach(item => {
    // if the request item key exists in the ALLOWED_DATA array, save it
    if (process.env.ALLOWED_DATA.includes(item[0])) {
      data[item[0]] = item[1];
    }
  });

  db.instances.update({ instanceID: request.instanceID }, data, {
    upsert: true
  });

  logEvent({ event: "Starting to Update Instance", payload: data });
  return 204;
};

export const doneUpdatingInstance = request => {
  if (!request.instanceID) {
    return 400;
  }

  const requestItems = Object.entries(request);
  const data = {};

  requestItems.forEach(item => {
    // if the request item key exists in the ALLOWED_DATA array, save it
    if (process.env.ALLOWED_DATA.includes(item[0])) {
      data[item[0]] = item[1];
    }
  });

  db.instances.update({ instanceID: request.instanceID }, data, {
    upsert: true
  });

  logEvent({ event: "Deleted Instance", payload: request.instanceID });
  return 204;

  // Clear down if is chosen one
};

export const deleteInstance = request => {
  if (!request.instanceID) {
    return 400;
  }
  db.instances.remove({ instanceID: request.instanceID }, true);
  logEvent({ event: "Deleted Instance", payload: request.instanceID });
  return 204;
};

const groupBy = (arr, criteria) => {
  return arr.reduce(function(obj, item) {
    // Check if the criteria is a function to run on the item or a property of it
    var key = typeof criteria === "function" ? criteria(item) : item[criteria];

    // If the key doesn't exist yet, create it
    if (!obj.hasOwnProperty(key)) {
      obj[key] = [];
    }

    // Push the value to the object
    obj[key].push(item);

    // Return the object to the next item in the loop
    return obj;
  }, {});
};

export const getInstances = urlParams => {
  if (urlParams.groupBy) {
    const groupByValue = urlParams.groupBy;

    delete urlParams.groupBy;

    const stacks = db.instances.find(urlParams);

    return groupBy(stacks, instance => instance[groupByValue]);
  } else {
    return db.instances.find(urlParams);
  }
};
