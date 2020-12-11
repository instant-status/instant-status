import db from 'diskdb';
import ALLOWED_DATA, { AllowedDataType } from '../../../config/allowedData';

export const getDemoData = (urlParams: { [k: string]: string }) => {
  db.connect('../data', ['demo']);
  return db.demo.find(urlParams);
};

export const addDemoData = (
  request: {
    [k in AllowedDataType]: string;
  }
) => {
  db.connect('../data', ['demo']);

  const requestItems = Object.entries(request);
  const data = {};

  requestItems.forEach((item) => {
    // if the request item key exists in the ALLOWED_DATA array, save it
    if (ALLOWED_DATA.includes(item[0] as AllowedDataType)) {
      data[item[0]] = item[1];
    }
  });

  db.demo.save(data);
  return data;
};
