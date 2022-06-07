self._$rewriteURL = (url) => {
  if (/^(data|mailto|chrome-extension):/.test(url)) return url;
  if (url.startsWith(_$config.prefix)) return url;

  url = url.split(location.host);
  if (url.length > 1) {
    url = url.slice(1).join(location.host);
  } else {
    url = url.join(location.host);
  }

  // http(s)://example.com/
  if (/^https?:\/\//.test(url)) {
    return _$config.prefix + _$config.codec.encode(url);
  }

  const _location = new URL(_$config.codec.decode(location.href.split(_$config.prefix).slice(1).join(_$config.prefix)));

  // //example.com/
  if (/^\/\//.test(url)) {
    return _$config.prefix + _$config.codec.encode(_location.protocol + url);
  }

  // ./script.js
  if (/^\.\//.test(url)) {
    let path = _location.pathname;
    path += url.slice(_location.pathname.slice(-1) !== "/" ? 1 : 2);
    return _$config.prefix + _$config.codec.encode(_location.protocol + "//" + _location.host + path);
  }

  // /about.html
  if (/^\//.test(url)) {
    return _$config.prefix + _$config.codec.encode(_location.protocol + "//" + _location.host + url);
  }

  // script.js
  let path = _location.pathname;
  path += _location.pathname.slice(-1) !== "/" ? "/" : "" + url;
  return _$config.prefix + _$config.codec.encode(_location.protocol + "//" + _location.host + path);
}

self._$combine = (url, path) => {
  url = new URL(url);
  if (/^\//.test(path)) {
    return url.origin.replace(/\/$/, "") + path;
  } else if (/^\.\//.test(path)) {
    return url.href.replace(/\/$/, "") + path.replace(/^\./, "");
  } else if (/^\.\.\//.test(path)) {
    return url.href.replace(/\/[^/]+?\/?$/, "") + path.replace(/^\.\./, "");
  } else {
    return url.href.replace(/\/?$/, "/") + path;
  }
}
