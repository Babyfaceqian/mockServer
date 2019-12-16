'use strict'
import { getJSON, getFilePath } from '../helper';
let indexes = getJSON('indexes');
exports.getMockData = function (indexId) {
  return async (ctx, next) => {
    let data = indexes[indexId];
    ctx.body = data;
    console.log('data', data, indexId);
    return next;
  }
}