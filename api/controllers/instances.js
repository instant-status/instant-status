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

export const getInstances = urlParams => {
  db.connect("../data", ["instances"]);
  return db.instances.find(urlParams);
};
