import db from "diskdb";

export const addPrimalInstance = request => {
  db.connect("../data", ["instances"]);

  const requestItems = Object.entries(request);
  const data = {};

  requestItems.forEach(item => {
    // if the request item key exists in the ALLOWED_DATA array, save it
    if (process.env.ALLOWED_DATA.includes(item[0])) {
      data[item[0]] = item[1];
    }
  });

  db.instances.save(data);
  return data;
};

export const getInstanceById = thing => {};

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
