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
  let jsonStr = JsonFormat(body.templateIds);
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
  let currentTemplate = getJSON('currentTemplate') || [];
  if (currentTemplate.includes(templateId)) {
    ctx.body = {
      success: false,
      data: null,
      msg: '该接口集正在使用，无法删除'
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
  let currentTemplate = getJSON('currentTemplate') || {};
  ctx.body = {
    success: true,
    data: currentTemplate
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

exports.copyTemplate = async (ctx, next) => {
  let name = ctx.request.body.name;
  let copyId = ctx.request.body.copyId;
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
  let templates = getJSON('templates') || {};
  let copyTemplate = templates[copyId];
  let indexes = getJSON('indexes') || {};
  let fns = getJSON('fns') || {};
  templates[id] = {};
  Object.keys(copyTemplate).forEach(path => {
    templates[id][path] = {};
    templates[id][path].ids = copyTemplate[path].ids.map(d => {
      let pathId = uuid();
      indexes[pathId] = indexes[d];
      return pathId;
    });
    templates[id][path].method = copyTemplate[path].method;
    let fnId = uuid();
    templates[id][path].fnId = fnId;
    fns[fnId] = fns[copyTemplate[path].fnId];
  })
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
    data: id
  }
  return next;
}

exports.editTemplate = async (ctx, next) => {
  let name = ctx.request.body.name;
  let id = ctx.request.body.id;
  let config = getJSON('config') || [];
  config.find(d => d.id === id).name = name;
  let configStr = JsonFormat(config);
  fs.writeFile(getFilePath('config'), configStr, 'utf8', (err) => {
    if (err) throw err;
    console.log('done');
  });
  ctx.body = {
    success: true
  }
  return next;
}

exports.editPath = async (ctx, next) => {
  let method = ctx.request.body.method;
  let path = ctx.request.body.path;
  let id = ctx.request.body.id;
  let templates = getJSON('templates') || [];
  templates[id][path].method = method
  let templatesStr = JsonFormat(templates);
  fs.writeFile(getFilePath('templates'), templatesStr, 'utf8', (err) => {
    if (err) throw err;
    console.log('done');
  });
  ctx.body = {
    success: true
  }
  return next;
}