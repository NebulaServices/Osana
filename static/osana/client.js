window._location = new Proxy(location, {
  get (target, prop, receiver) {
    return Reflect.get(...arguments);
  },
  
  set(obj, prop, value) {
    return Reflect.set(...arguments);
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
