'use strict';
import path from 'path';
// import fs from 'fs';
export const getFilePath = function (fileName) {
  return path.resolve(__dirname, '../data/' + fileName + '.json')
};
export const getJSON = (fileName) => {
  // let f = fs.readFile(getFilePath(fileName), "utf-8", function (err, data) {
  //   let j = JSON.parse(data);
  //   return j;
  // })
  const json = require(getFilePath(fileName));
  return json;
}