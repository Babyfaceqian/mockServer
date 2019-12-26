import { worm } from 'utils';
import { PREFIX } from 'config';
function makeRequestCreator(url, method) {
  if (method == 'post') {
    return async function (params) {
      return worm.post(url, params);
    };
  } else {
    return async function (params) {
      return worm.get(url, params);
    }
  }
}
export const getConfig = makeRequestCreator(PREFIX + '/getConfig', 'get');
export const reload = makeRequestCreator(PREFIX + '/reload', 'get');
export const getCurrent = makeRequestCreator(PREFIX + '/getCurrent', 'get');
export const setCurrent = makeRequestCreator(PREFIX + '/setCurrent', 'post');
