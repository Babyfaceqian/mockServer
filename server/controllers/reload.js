import uuid from 'uuid/v4';
import fs from 'fs';
import path from 'path';
exports.reload = async (ctx, next) => {
  let id = uuid();
  fs.writeFile(path.resolve(__dirname, '../data/reload'), id, 'utf8', (err) => {
    if (err) throw err;
    console.log('done');
  });
  ctx.body = {
    success: true
  }
  return next;
}
