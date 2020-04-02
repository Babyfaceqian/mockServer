'use strict'

import Router from 'koa-router'
import App from '../controllers/app'
import Reload from '../controllers/reload';
import Mock from '../controllers/mock'
const METHOD = {
  GET: 'get',
  POST: 'post'
}
import templates from '../data/templates.json';
const currentIds = require('../data/currentTemplate.json');
module.exports = function () {
  var router = new Router({
    // prefix: '/api'
  })
  router.get('/reload', Reload.reload);

  router.get('/mock/getConfig', App.getConfig);
  router.post('/mock/createTemplate', App.createTemplate);
  router.post('/mock/createPath', App.createPath);
  router.get('/mock/getPathDict', App.getPathDict);
  router.get('/mock/getPathData', App.getPathData);
  router.post('/mock/updatePathData', App.updatePathData);
  router.post('/mock/setCurrent', App.setCurrent);
  router.post('/mock/deleteTemplate', App.deleteTemplate);
  router.post('/mock/deletePath', App.deletePath);
  router.get('/mock/getCurrent', App.getCurrent);
  router.post('/mock/updatePathFn', App.updatePathFn);
  router.post('/mock/createPathData', App.createPathData);
  router.get('/mock/getFn', App.getFn);
  router.post('/mock/deletePathData', App.deletePathData);
  router.post('/mock/copyTemplate', App.copyTemplate);
  router.post('/mock/editTemplate', App.editTemplate);
  router.post('/mock/editPath', App.editPath);
  router.get('/mock/clearZombieData', App.clearZombieData);

  let pathObj = {};
  currentIds.forEach(id => {
    Object.keys(templates[id]).forEach(path => {
      pathObj[path] = templates[id][path];
    })
  })
  Object.keys(pathObj).forEach(key => {
    let obj = pathObj[key];
    let method = METHOD[obj.method];
    router[method](key, Mock.getMockData(obj));
  })
  return router
}