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
export const getCurrent = makeRequestCreator(PREFIX + '/mock/getCurrent', 'get');
export const getPathDict = makeRequestCreator(PREFIX + '/mock/getPathDict', 'get');
export const getConfig = makeRequestCreator(PREFIX + '/mock/getConfig', 'get');
export const getPathData = makeRequestCreator(PREFIX + '/mock/getPathData', 'get');
export const updatePathData = makeRequestCreator(PREFIX + '/mock/updatePathData', 'post');
export const createTemplate = makeRequestCreator(PREFIX + '/mock/createTemplate', 'post');
export const createPath = makeRequestCreator(PREFIX + '/mock/createPath', 'post');
export const setCurrent = makeRequestCreator(PREFIX + '/mock/setCurrent', 'post');
export const deleteTemplate = makeRequestCreator(PREFIX + '/mock/deleteTemplate', 'post');
export const deletePath = makeRequestCreator(PREFIX + '/mock/deletePath', 'post');
export const reload = makeRequestCreator(PREFIX + '/mock/reload', 'get');
export const updatePathFn = makeRequestCreator(PREFIX + '/mock/updatePathFn', 'post');
export const addPathData = makeRequestCreator(PREFIX + '/mock/createPathData', 'post');
export const getFn = makeRequestCreator(PREFIX + '/mock/getFn', 'get');
export const deletePathData = makeRequestCreator(PREFIX + '/mock/deletePathData', 'post');
export const copyTemplate = makeRequestCreator(PREFIX + '/mock/copyTemplate', 'post');
export const editTemplate = makeRequestCreator(PREFIX + '/mock/editTemplate', 'post');
export const editPath = makeRequestCreator(PREFIX + '/mock/editPath', 'post');