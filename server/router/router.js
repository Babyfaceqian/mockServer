'use strict'

import Router from 'koa-router'
import App from '../controllers/app'
import Reload from '../controllers/reload';
import Mock from '../controllers/mock'
import templates from '../data/templates.json';
const METHOD = {
  GET: 'get',
  POST: 'post'
}
const current = require('../data/currentTemplate.json').current;
module.exports = function () {
  var router = new Router({
    // prefix: '/api'
  })
  router.get('/reload', Reload.reload);

  router.get('/getConfig', App.getConfig);
  router.post('/createTemplate', App.createTemplate);
  router.post('/createPath', App.createPath);
  router.get('/getPathDict', App.getPathDict);
  router.get('/getPathData', App.getPathData);
  router.post('/updatePathData', App.updatePathData);
  router.post('/setCurrent', App.setCurrent);
  router.post('/deleteTemplate', App.deleteTemplate);
  router.post('/deletePath', App.deletePath);
  router.get('/getCurrent', App.getCurrent);
  router.post('/updatePathFn', App.updatePathFn);
  router.post('/createPathData', App.createPathData);
  router.get('/getFn', App.getFn);
  router.post('/deletePathData', App.deletePathData);
  router.post('/copyTemplate', App.copyTemplate);
  router.post('/editTemplate', App.editTemplate);
  router.post('/editPath', App.editPath);
  
  let pathObj = templates[current];
  if (pathObj) {
    Object.keys(pathObj).forEach(key => {
      let obj = pathObj[key];
      let method = METHOD[obj.method];
      router[method](key, Mock.getMockData(obj));
    })
  }
  return router
}