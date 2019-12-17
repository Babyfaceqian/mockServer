'use strict';
import path from 'path';
import fs from 'fs';
export const getFilePath = function (fileName) {
  return path.resolve(__dirname, '../data/' + fileName + '.json')
};
export const getJSON = (fileName) => {
  let f = fs.readFileSync(getFilePath(fileName), "utf-8")
  return JSON.parse(f)
}