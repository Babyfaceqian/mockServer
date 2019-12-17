'use strict'
import { getJSON } from '../helper';
exports.getMockData = function (obj) {
  return async (ctx, next) => {
    let indexes = getJSON('indexes');
    let fns = getJSON('fns');
    let ids = obj.ids;
    let fnId = obj.fnId;
    let fn = fns[fnId];
    let index;
    if (fn) {
      index = new Function('ctx', fn)(ctx);
    } else {
      index = 0;
    }
    let id = ids[index];
    let data = indexes[id];
    console.log('fnId', fnId, fn, index, id, data)
    ctx.body = data;
    return next;
  }
}