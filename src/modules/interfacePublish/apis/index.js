import { worm } from 'utils';
import { PREFIX } from 'config/apiConfig';
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
export const getConfig = makeRequestCreator(PREFIX + '/mock/getConfig', 'get');
export const reload = makeRequestCreator(PREFIX + '/mock/reload', 'get');
export const getCurrent = makeRequestCreator(PREFIX + '/mock/getCurrent', 'get');
export const setCurrent = makeRequestCreator(PREFIX + '/mock/setCurrent', 'post');
