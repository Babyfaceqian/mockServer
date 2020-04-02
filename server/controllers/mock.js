'use strict'
import { getJSON } from '../helper';
exports.getMockData = function (obj) {
  return async (ctx, next) => {
    let indexes = getJSON('indexes');
    let fns = getJSON('fns');
    let fn = fns[obj.fnId];
    let index;
    if (fn) {
      index = new Function('ctx', fn)(ctx);
    } else {
      index = 0;
    }
    let id = obj.ids[index];
    let data = indexes[id];
    ctx.body = data;
    return next;
  }
}