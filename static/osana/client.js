window._location = new Proxy(location, {
  get (target, prop, receiver) {
    const url = new URL(location.href.split(_$config.prefix).slice(1).join(_$config.prefix));
    return url[prop];
  },
  
  set(obj, prop, value) {
    const url = new URL(location.href.split(_$config.prefix).slice(1).join(_$config.prefix));
    url[prop] = value;
    location.href = _$config.prefix + url.href;
  }
});

window._window = new Proxy(window, {
  get (target, prop, reciever) {
    if (prop === "_location") {
      return _location;
    }
    return Reflect.get(...arguments);
  }
});
