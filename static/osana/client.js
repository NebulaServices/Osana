window._location = new Proxy(location, {
  get (target, prop, receiver) {
    const url = new URL(_$config.codec.decode(location.href.split(_$config.prefix).slice(1).join(_$config.prefix)));
    return url[prop];
  },
  set(obj, prop, value) {
    const url = new URL(_$config.codec.decode(location.href.split(_$config.prefix).slice(1).join(_$config.prefix)));
    url[prop] = value;
    location.href = _$config.prefix + url.href;
  }
});

window._window = new Proxy(window, {
  get (target, prop, reciever) {
    if (prop === "_location") {
      return _location;
    } else if (prop === "origin") {
      return _location.href;
    }
    return window[prop];
  }
});
window.open = new Proxy(open, {
  apply (target, thisArg, args) {
    if (args[0] && args[0] !== "about:blank") {
      args[0] = _$rewriteURL(args[0]);
    }
    Reflect.apply(...arguments);
  }
});
//_window.origin = _location.origin;

window.fetch = new Proxy(fetch, {
  apply (target, thisArg, args) {
    args[0] = _$rewriteURL(args[0]);
    Reflect.apply(...arguments);
  }
});

const XMLOpen = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function (...args) {
  args[1] = _$rewriteURL(args[1]);
  return XMLOpen.call(this, ...args);
};

document._location = _location
document.baseURI = _location.href;
document.documentURI = _location.href;
Object.defineProperty(document, "domain", {
	get() {
		return _location.hostname;
	},
	set(value) {
		return value;
	}
});
