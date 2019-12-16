const config = {};
export const worm = {
  async post(request, data, init) {
    let options = Object.assign({}, config);
    if (init) {
      options = Object.assign(options, init);
    }
    if (data) {
      options.body = JSON.stringify(data);
    }
    options.method = 'post';
    options.headers = {
      'Content-type': 'application/json'
    }
    try {
      let res = await fetch(request, options);
      return res.json();
    } catch (e) {
      return undefined;
    }
  },
  async get(request, data, init) {
    let options = Object.assign({}, config);
    if (init) {
      options = Object.assign(options, init);
    }
    let _url = request;
    if (data) {
      _url += '?';
      Object.keys(data).forEach(function (key) {
        _url += key + '=' + data[key];
      })
    }
    options.method = 'get';
    try {
      let res = await fetch(_url, options);
      return res.json();
    } catch (e) {
      return undefined;
    }
  },
}