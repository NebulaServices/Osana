self._$combine = (url, path) => {
  url = new URL(url);
  url.pathname = url.pathname.replace(/[^/]+?\.[^/]+?$/, "");
  if (/^\//.test(path)) {
    return url.origin + path;
  } else if (/^\.\//.test(path)) {
    return url.href.replace(/\/$/, "") + path.replace(/^\./, "");
  } else if (/^\.\.\//.test(path)) {
    return url.href.replace(/\/[^/]+?\/?$/, "") + path.replace(/^\.\./, "");
  } else {
    return url.href.replace(/\/?$/, "/") + path;
  }
}

self._$rewriteURL = (url) => {
  if (/^(about|javascript|blob|data|mailto|chrome-extension):/.test(url)) return url;
  if (url.startsWith(_$config.prefix)) return url;

  const _location = new URL(_$config.codec.decode(location.href.replace(new RegExp(`^.+?${_$config.prefix}`), "")));

  if (/^https?:\/\//.test(url)) {
    return _$config.prefix + _$config.codec.encode(url);
  } else if (/^\/\//.test(url)) {
    return _$config.prefix + _$config.codec.encode(_location.protocol + url);
  } else if (/^\.\//.test(url)) {
    return _$config.prefix + _$config.codec.encode(_$combine(_location.origin + _location.pathname, url));
  } else if (/^\//.test(url)) {
    return _$config.prefix + _$config.codec.encode(_$combine(_location.origin, url));
  }

  return _$config.prefix + _$config.codec.encode(_$combine(_location.origin + _location.pathname, url));
}
