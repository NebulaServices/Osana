self._$rewriteURL = (url) => {
  if (/^(data|mailto|chrome-extension):/.test(url)) return url;
  if (url.startsWith(_$config.prefix)) return url;

  url = url.split(location.host);
  if (url.length > 1) {
    url = url.slice(1).join(location.host);
  } else {
    url = url.join(location.host);
  }

  const _location = new URL(_$config.codec.decode(location.href.split(_$config.prefix).slice(1).join(_$config.prefix)));

  // http(s)://example.com/
  if (/^https?:\/\//.test(url)) {
    return _$config.prefix + _$config.codec.encode(url);
  }

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

self._$rewriteJS = (js) => {
  return js.replace(/location|window/g, "_$&");
}


self._$rewriteElement = (elm) => {
  if (!elm.tagName) return;
  const tag = elm.tagName.toLowerCase();
  elm.removeAttribute("integrity");
  elm.removeAttribute("nonce");
  if (tag === "a") {

    if (elm.getAttribute("_href")) return;
    elm.setAttribute("_href", elm.href);
    elm.href = _$rewriteURL(elm.href);

  } else if (tag === "link") {

    if (["stylesheet", "icon", "apple-touch-icon", "manifest"].includes(elm.rel)) {
      if (elm.getAttribute("_href")) return;
      elm.setAttribute("_href", elm.href);
      elm.href = _$rewriteURL(elm.href);
    }

  } else if (tag === "meta") {

    if (elm.httpEquiv === "content-security-policy") {
      elm.content = "";
    } else if (elm.httpEquiv === "refresh") {
      let url = elm.content.split(/url=/i).slice(1).join("url=");
      elm.content = elm.content.split(/url=/i)[0] + "url=" + _$rewriteURL(url);
    }

  } else if (tag === "iframe") {

    if (elm.getAttribute("_src")) return;
    elm.setAttribute("_src", elm.src);
    elm.src = _$rewriteURL(elm.src);

  } else if (tag === "script") {

    if (elm.getAttribute("_osana")) return;
    const script = document.createElement("script");
    script.setAttribute("_src", elm.src);
    if (elm.src) script.src = _$rewriteURL(elm.src);
    if (elm.type) script.type = elm.type;
    if (elm.defer) script.defer = elm.defer;
    if (elm.async) script.async = elm.async;
    script.innerHTML = _$rewriteJS(elm.innerHTML);
    script.setAttribute("_osana", true);

    elm.after(script);

    elm.remove();

  } else if (tag === "img") {

    if (elm.getAttribute("_src")) return;
    elm.setAttribute("_src", elm.src);
    if (elm.srcset) {
      let sources = elm.srcset.split(/[0-9]x,?/);
      let srcset = "";
      for (let i = 0; i < sources.length; i++) {
        srcset += ", " + _$rewriteURL(sources[i].trim()) + ` ${i+1}x`;
      }
      elm.seetAttribute("_srcset", elm.srcset);
      elm.srcset = srcset;
    }
    elm.src = _$rewriteURL(elm.src);

  } else if (tag === "form") {

    if (elm.getAttribute("_action")) return;
    if (elm.action) {
      elm.setAttribute("_action", elm.action);
      elm.action = _$rewriteURL(elm.action);
    }

  }
}
