self._$rewriteJS = (js) => {
  return js.replace(/location|window/g, "_$&");
}

function braidArrays (arr1, arr2) {
  let len = Math.max(arr1.length, arr2.length);
  let braided = [];
  for (let i = 0; i < len; i++) {
    braided.push(arr1[i]);
    braided.push(arr2[i]);
  }
  return braided;
}

// rewrite url()'s in css
self._$rewriteCSS = (css = "") => {
  let sections = css.split(/url\([^\s]+?\)/gi);
  if (!sections[1]) return css;
  let urls = css.match(/url\([^\s]+?\)/gi);
  let parsedURLs = [];
  urls.forEach((url) => {
    if (/https?:\/\//.test(url.split(/\(("|')?|("|')?\)/)[3])) {
      parsedURLs.push(`url('${location.origin}${_$rewriteURL(url.split(/\(("|')?|("|')?\)/)[3])}')`);
    } else {
      parsedURLs.push(url);
    }
  });
  return braidArrays(sections, parsedURLs).join("");
}






self._$rewriteElement = (elm) => {
  if (!elm.tagName) return;
  const tag = elm.tagName.toLowerCase();
  elm.removeAttribute("integrity");
  elm.removeAttribute("nonce");
  
  // rewrite <a>'s
  if (tag === "a") {

    if (elm.getAttribute("_href")) return;
    elm.setAttribute("_href", elm.href);
    elm.href = _$rewriteURL(elm.href);

  // rewrite <link>'s
  } else if (tag === "link") {

    if (["icon", "shortcut icon", "apple-touch-icon", "manifest", "prefetch", "preload", "canonical", "next", "alternate"].includes(elm.rel)) {

      if (elm.getAttribute("_href")) return;
      elm.setAttribute("_href", elm.href);
      elm.href = _$rewriteURL(elm.href);

    } else if (elm.rel === "stylesheet") {

      if (elm.getAttribute("_osana")) return;
      if (elm.href) elm.href = _$rewriteURL(elm.href);
      elm.setAttribute("_osana", true);

    }

  // rewrite <meta>'s
  } else if (tag === "meta") {

    if (elm.httpEquiv === "content-security-policy") {

      if (elm.getAttribute("_content")) return;
      elm.setAttribute("_content", elm.content);
      elm.content = "";

    } else if (elm.httpEquiv === "refresh") {

      if (elm.getAttribute("_content")) return;
      elm.setAttribute("_content", elm.content);
      let url = elm.content.split(/url=/i).slice(1).join("url=");
      elm.content = elm.content.split(/url=/i)[0] + "url=" + _$rewriteURL(url);

    } else if (elm.getAttribute("itemprop") === "image") {

      if (elm.getAttribute("_content")) return;
      elm.setAttribute("_content", elm.content);
      elm.content = _$rewriteURL(elm.content);

    }

  // rewrite <script>'s
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

    elm.after.bind(script);
    elm.remove();

  // rewrite <form>'s
  } else if (tag === "form") {

    if (elm.getAttribute("_action")) return;
    if (elm.action) {
      elm.setAttribute("_action", elm.action);
      elm.action = _$rewriteURL(elm.action);
    }

  // rewrite src attrs
  } else if (["img", "embed", "video", "audio", "source", "iframe"].includes(tag)) {

    if (elm.getAttribute("_src")) return;
    elm.setAttribute("_src", elm.src);
    elm.src = _$rewriteURL(elm.src);

  // rewrite <object>'s
  } else if (tag === "object") {

    if (elm.getAttribute("_data")) return;
    elm.setAttribute("_data", elm.data);
    elm.data = _$rewriteURL(elm.data);
  
  // rewrite <style>'s
  } else if (tag === "style") {
      
    if (elm.getAttribute("_osana")) return;
    elm.innerHTML = _$rewriteCSS(elm.innerHTML);
    elm.setAttribute("_osana", true);
    
  }
}
