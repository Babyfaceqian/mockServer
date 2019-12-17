import { getJSON, getFilePath } from '../helper';
import uuid from 'uuid/v4';
import fs from 'fs';
import JsonFormat from 'json-format';
exports.getConfig = async (ctx, next) => {
  ctx.body = {
    success: true,
    data: getJSON('config') || []
  }
  return next;
}

exports.createTemplate = async (ctx, next) => {
  let name = ctx.request.body.name;
  let config = getJSON('config') || [];
  let id = uuid();
  config.push({
    id,
    name,
  });
  let jsonStr = JsonFormat(config);
  fs.writeFile(getFilePath('config'), jsonStr, 'utf8', (err) => {
    if (err) throw err;
    console.log('done');
  });
  let tempaltes = getJSON('templates') || {};
  tempaltes[id] = {};
  let tempaltesStr = JsonFormat(tempaltes);
  fs.writeFile(getFilePath('templates'), tempaltesStr, 'utf8', (err) => {
    if (err) throw err;
    console.log('done');
  });
  ctx.body = {
    success: true,
    data: id
  }
  return next;
}

exports.createPath = async (ctx, next) => {
  let body = ctx.request.body;
  let templateId = body.templateId;
  let path = body.path;
  let method = body.method.toUpperCase();
  let tempaltes = getJSON('templates') || {};
  let pathId = uuid();
  let fnId = uuid();
  tempaltes[templateId][path] = {
    ids: [pathId],
    method,
    fnId
  };
  let jsonStr = JsonFormat(tempaltes);
  fs.writeFile(getFilePath('templates'), jsonStr, 'utf8', (err) => {
    if (err) throw err;
    console.log('done');
  });
  ctx.body = {
    success: true,
    data: path
  }
}

exports.getPathDict = async (ctx, next) => {
  let tempaltes = getJSON('templates') || {};
  let id = ctx.query.id;
  let data = tempaltes[id] || {};
  ctx.body = {
    success: true,
    data
  }
  return next;
}

exports.getPathData = async (ctx, next) => {
  let indexes = getJSON('indexes') || {};
  let id = ctx.query.id;
  let data = indexes[id];
  ctx.body = {
    success: true,
    data
  }
  return next;
}

exports.updatePathData = async (ctx, next) => {
  let body = ctx.request.body;
  let pathDataId = body.pathDataId;
  let pathData = body.pathData;
  if (!pathDataId || !pathData) {
    ctx.body = {
      success: false,
      data: null
    }
    return next
  }
  let indexes = getJSON('indexes') || {};
  indexes[pathDataId] = JSON.parse(pathData);
  let indexesStr = JsonFormat(indexes);
  fs.writeFile(getFilePath('indexes'), indexesStr, 'utf8', (err) => {
    if (err) throw err;
    console.log('done');
  })
  ctx.body = {
    success: true,
    data: null
  }
  return next;
}

exports.setCurrent = async (ctx, next) => {
  let body = ctx.request.body;
  let templateId = body.templateId;
  let currentObj = getJSON('currentTemplate') || {};
  currentObj.current = templateId;
  let jsonStr = JsonFormat(currentObj);
  fs.writeFile(getFilePath('currentTemplate'), jsonStr, 'utf8', (err) => {
    if (err) throw err;
    console.log('done');
  });
  ctx.body = {
    success: true,
    data: null
  };
  return next;
}

exports.deleteTemplate = async (ctx, next) => {
  let body = ctx.request.body;
  let templateId = body.templateId;
  let currentObj = getJSON('currentTemplate') || {};
  if (templateId === currentObj.current) {
    ctx.body = {
      success: false,
      data: null,
      msg: '该模板正在使用，无法删除'
    };
    return next;
  }
  let config = getJSON('config') || [];
  let templates = getJSON('templates') || {};
  config = config.filter(d => d.id !== templateId);
  let newTemplates = {};
  Object.keys(templates).forEach(key => {
    if (key === templateId) return;
    newTemplates[key] = templates[key];
  })
  let configStr = JsonFormat(config);
  fs.writeFile(getFilePath('config'), configStr, 'utf8', (err) => {
    if (err) throw err;
    console.log('done');
  });
  let templatesStr = JsonFormat(newTemplates);
  fs.writeFile(getFilePath('templates'), templatesStr, 'utf8', (err) => {
    if (err) throw err;
    console.log('done');
  });
  ctx.body = {
    success: true,
    data: null
  };
  return next;
}

exports.deletePath = async (ctx, next) => {
  let body = ctx.request.body;
  let templateId = body.templateId;
  let path = body.path;
  let templates = getJSON('templates') || {};
  let pathObj = templates[templateId][path];
  let pathDataIds = pathObj.ids.slice();
  delete templates[templateId][path];
  let indexes = getJSON('indexes') || {};
  pathDataIds.forEach(id => {
    delete indexes[id];
  })
  let fns = getJSON('fns') || {};
  delete fns[pathObj.fnId];
  let templatesStr = JsonFormat(templates);
  fs.writeFile(getFilePath('templates'), templatesStr, 'utf8', (err) => {
    if (err) throw err;
    console.log('done');
  });
  let indexesStr = JsonFormat(indexes);
  fs.writeFile(getFilePath('indexes'), indexesStr, 'utf8', (err) => {
    if (err) throw err;
    console.log('done');
  });
  let fnsStr = JsonFormat(fns);
  fs.writeFile(getFilePath('fns'), fnsStr, 'utf8', (err) => {
    if (err) throw err;
    console.log('done');
  });
  ctx.body = {
    success: true,
    data: null
  };
  return next;
}

exports.getCurrent = async (ctx, next) => {
  let currentObj = getJSON('currentTemplate') || {};
  let templateId = currentObj.current;
  let config = getJSON('config') || [];
  let obj = config.find(d => d.id === templateId) || {};
  let templates = getJSON('templates');
  let pathDict = templates[templateId] || {};
  let pathList = Object.keys(pathDict);
  ctx.body = {
    success: true,
    data: {
      id: templateId,
      name: obj.name,
      list: pathList
    }
  };
  return next;
}

exports.updatePathFn = async (ctx, next) => {
  let body = ctx.request.body;
  let fns = getJSON('fns') || {};
  let fnId = body.fnId;
  let fn = body.fn;
  fns[fnId] = fn;
  let fnsStr = JsonFormat(fns);
  fs.writeFile(getFilePath('fns'), fnsStr, 'utf8', (err) => {
    if (err) throw err;
    console.log('done');
  });
  ctx.body = {
    success: true,
    data: null
  };
  return next;
}

exports.createPathData = async (ctx, next) => {
  let body = ctx.request.body;
  let templateId = body.templateId;
  let path = body.path;
  let templates = getJSON('templates') || {};
  let pathDataId = uuid();
  templates[templateId][path].ids.push(pathDataId);
  let templatesStr = JsonFormat(templates);
  fs.writeFile(getFilePath('templates'), templatesStr, 'utf8', (err) => {
    if (err) throw err;
    console.log('done');
  });
  ctx.body = {
    success: true,
    data: null
  };
  return next;
}

exports.getFn = async (ctx, next) => {
  let id = ctx.query.id;
  let fns = getJSON('fns') || {};
  ctx.body = {
    success: true,
    data: fns[id]
  }
  return next;
}

exports.deletePathData = async (ctx, next) => {
  let body = ctx.request.body;
  let templateId = body.templateId;
  let path = body.path;
  let index = body.index;
  let templates = getJSON('templates') || {};
  let id = templates[templateId][path].ids[index];
  templates[templateId][path].ids.splice(index, 1);
  let indexes = getJSON('indexes') || {};
  delete indexes[id];
  let templatesStr = JsonFormat(templates);
  fs.writeFile(getFilePath('templates'), templatesStr, 'utf8', (err) => {
    if (err) throw err;
    console.log('done');
  });
  let indexesStr = JsonFormat(indexes);
  fs.writeFile(getFilePath('indexes'), indexesStr, 'utf8', (err) => {
    if (err) throw err;
    console.log('done');
  });
  ctx.body = {
    success: true
  }
  return next;
}