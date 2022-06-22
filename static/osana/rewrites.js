self._$rewriteJS = (js) => {
  return js.replace(/location|window/g, "_$&");
}

// helper function for rewriting css
let weave=(...r)=>{for(var a=1,f=0,h=[];a;)a=0,r.forEach(r=>{r[f]&&(h.push(r[f]),a=1)}),f++;return h};

// rewrite url()'s in css
self._$rewriteCSS = (css = "") => {
  let sections = css.split(/url\([^\s]+?\)/gi);
  if (!sections[1]) return css;
  let urls = css.match(/url\([^\s]+?\)/gi);
  let parsedURLs = [];
  urls.forEach((url) => {
    if (/(https?:)?\/\//.test(url.split(/\(("|')?|("|')?\)/)[3])) {
      parsedURLs.push(`url('${_$rewriteURL(url.split(/\(("|')?|("|')?\)/)[3])}')`);
    } else {
      parsedURLs.push(url);
    }
  });
  return weave(sections, parsedURLs).join("");
}


self._$rewriteElement = (elm) => {
  if (!elm.tagName) return;
  const tag = elm.tagName.toLowerCase();
  elm.removeAttribute("integrity");
  elm.removeAttribute("nonce");

  // rewrite style attr
  if (!elm.getAttribute("_style") && elm.getAttribute("style")) {
    elm.setAttribute("style", _$rewriteCSS(elm.getAttribute("style")));
  }
  
  // rewrite <a>'s
  if (tag === "a") {

    if (elm.getAttribute("_href")) return;
    elm.setAttribute("_href", elm.getAttribute("href"));
    elm.setAttribute("href", _$rewriteURL(elm.getAttribute("href")));

  // rewrite <link>'s
  } else if (tag === "link") {

    if (["icon", "shortcut icon", "apple-touch-icon", "manifest", "prefetch", "preload", "canonical", "next", "alternate"].includes(elm.rel)) {

      if (elm.getAttribute("_href")) return;
      elm.setAttribute("_href", elm.getAttribute("href"));
      elm.setAttribute("href", _$rewriteURL(elm.getAttribute("href")));

    } else if (elm.getAttribute("rel") === "stylesheet") {

      if (elm.getAttribute("_href")) return;
      elm.setAttribute("_href", elm.getAttribute("href"));
      elm.setAttribute("href", _$rewriteURL(elm.getAttribute("href")));

    }

  // rewrite <meta>'s
  } else if (tag === "meta") {

    if (elm.getAttribute("httpEquiv") === "content-security-policy") {

      if (elm.getAttribute("_content")) return;
      elm.setAttribute("_content", elm.getAttribute("content"));
      elm.setAttribute("content", "");

    } else if (elm.getAttribute("httpEquiv") === "refresh") {

      if (elm.getAttribute("_content")) return;
      elm.setAttribute("_content", elm.getAttribute("content"));
      let url = elm.getAttribute("content").split(/url=/i).slice(1).join("url=");
      elm.setAttribute("content", elm.getAttribute("content").split(/url=/i)[0] + "url=" + _$rewriteURL(url));

    } else if (elm.getAttribute("itemprop") === "image") {

      if (elm.getAttribute("_content")) return;
      elm.setAttribute("_content", elm.getAttribute("content"));
      elm.setAttribute("content", _$rewriteURL(elm.getAttribute("content")));

    }

  // rewrite <script>'s
  } else if (tag === "script") {


    if (elm.getAttribute("_osana")) return;
    const script = document.createElement("script");
    
    if (elm.getAttribute("src")) {
      script.setAttribute("_src", elm.getAttribute("src"));
      script.setAttribute("src", _$rewriteURL(elm.getAttribute("src")));
    }
    if (elm.getAttribute("type")) script.setAttribute("type", elm.getAttribute("type"));
    if (elm.getAttribute("defer")) script.setAttribute("defer", elm.getAttribute("defer"));
    if (elm.getAttribute("async")) script.setAttribute("async", elm.getAttribute("async"));
    if (elm.getAttribute("innerHTML")) {
      script.setAttribute("_innerHTML", elm.getAttribute("innerHTML"));
      script.setAttribute("innerHTML", _$rewriteJS(elm.getAttribute("innerHTML")));
    }
    script.setAttribute("_osana", true);

    elm.after.bind(script);
    elm.remove();

  // rewrite <form>'s
  } else if (tag === "form") {

    if (elm.getAttribute("_action")) return;
    if (elm.getAttribute("action")) {
      elm.setAttribute("_action", elm.getAttribute("action"));
      elm.setAttribute("action", _$rewriteURL(elm.getAttribute("action")));
    }

  // rewrite src attrs
  } else if (["img", "embed", "video", "audio", "source", "iframe"].includes(tag)) {
    // TODO: proxy srcset attrs for images

    if (elm.getAttribute("_src")) return;
    elm.setAttribute("_src", elm.getAttribute("src"));
    elm.setAttribute("src", _$rewriteURL(elm.getAttribute("src")));

  // rewrite <object>'s
  } else if (tag === "object") {

    if (elm.getAttribute("_data")) return;
    elm.setAttribute("_data", elm.getAttribute("data"));
    elm.setAttribute("data", _$rewriteURL(elm.getAttribute("data")));
  
  // rewrite <style>'s
  } else if (tag === "style") {
      
    if (elm.getAttribute("_innerHTML")) return;
    elm.setAttribute("_innerHTML", elm.getAttribute("innerHTML"));
    elm.setAttribute("innerHTML", _$rewriteCSS(elm.getAttribute("innerHTML")));
    
  }
}
