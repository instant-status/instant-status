import db from "diskdb";
import { logEvent } from "./logs";

export const addPrimalInstance = request => {
  db.connect("../data", ["instances"]);

  const requestItems = Object.entries(request);
  const data = {};

  requestItems.forEach(item => {
    // if the request item key exists in the ALLOWED_DATA array, save it
    if (process.env.ALLOWED_DATA.includes(item[0])) {
      data[item[0]] = item[1];
    }
    data.createdAt = new Date();
  });

  db.instances.save(data);
  logEvent(data);
  return data;
};

export const updateInstance = request => {
  db.connect("../data", ["instances"]);

  const requestItems = Object.entries(request);
  const data = {};

  requestItems.forEach(item => {
    // if the request item key exists in the ALLOWED_DATA array, save it
    if (process.env.ALLOWED_DATA.includes(item[0])) {
      data[item[0]] = item[1];
    }
  });

  db.instances.update({ ec2InstanceID: request.ec2InstanceID }, data, {
    upsert: true
  });
  logEvent({ event: "Starting to Update Instance", payload: data });
};

export const doneUpdatingInstance = request => {
  db.connect("../data", ["instances"]);

  const requestItems = Object.entries(request);
  const data = {};

  requestItems.forEach(item => {
    // if the request item key exists in the ALLOWED_DATA array, save it
    if (process.env.ALLOWED_DATA.includes(item[0])) {
      data[item[0]] = item[1];
    }
  });

  db.collectionName.update({ ec2InstanceID: request.ec2InstanceID }, data, {
    upsert: true
  });
  logEvent({ event: "Deleted Instance", payload: request.ec2InstanceID });

  // Clear down if is chosen one
};

export const deleteInstance = request => {
  db.connect("../data", ["instances"]);
  db.instances.remove({ ec2InstanceID: request.ec2InstanceID }, false);
  logEvent({ event: "Deleted Instance", payload: request.ec2InstanceID });
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
  db.connect("../data", ["instances"]);

  if (urlParams.groupBy) {
    const groupByValue = urlParams.groupBy;

    delete urlParams.groupBy;

    const stacks = db.instances.find(urlParams);

    return groupBy(stacks, instance => instance[groupByValue]);
  } else {
    return db.instances.find(urlParams);
  }
};
