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
export const clearZombieData = makeRequestCreator(PREFIX + '/mock/clearZombieData', 'get');
