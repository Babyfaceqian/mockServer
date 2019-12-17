import { worm } from 'utils';
const PREFIX = 'http://localhost:3000';
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
export const getCurrent = makeRequestCreator(PREFIX + '/getCurrent', 'get');
export const getPathDict = makeRequestCreator(PREFIX + '/getPathDict', 'get');
export const getConfig = makeRequestCreator(PREFIX + '/getConfig', 'get');
export const getPathData = makeRequestCreator(PREFIX + '/getPathData', 'get');
export const updatePathData = makeRequestCreator(PREFIX + '/updatePathData', 'post');
export const createTemplate = makeRequestCreator(PREFIX + '/createTemplate', 'post');
export const createPath = makeRequestCreator(PREFIX + '/createPath', 'post');
export const setCurrent = makeRequestCreator(PREFIX + '/setCurrent', 'post');
export const deleteTemplate = makeRequestCreator(PREFIX + '/deleteTemplate', 'post');
export const deletePath = makeRequestCreator(PREFIX + '/deletePath', 'post');
export const reload = makeRequestCreator(PREFIX + '/reload', 'get');