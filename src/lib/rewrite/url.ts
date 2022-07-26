import config from "../../config";

function combine (url: URL, path: string) {
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

export default function rewriteURL (url: string, origin?: string): string {
  let fakeLocation;
  if ("window" in self) {
    fakeLocation = new URL(window.__config.codec.decode(location.pathname.replace(new RegExp(`^${window.__config.prefix}`), "")));
  }
  if (origin) {
    fakeLocation = new URL(origin);
  }

  if (/^(data|mailto):/.test(url)) {
    return url;
  } else if (/^https?:\/\//.test(url)) {
    return `${config.prefix}${config.codec.encode(url)}`;
  } else if (/^\/\//.test(url)) {
    return `${config.prefix}${config.codec.encode(fakeLocation.protocol + url)}`;
  } else {
    if (!fakeLocation) return url;
    return `${config.prefix}${config.codec.encode(combine(fakeLocation, url))}`;
  }
}

export function unwriteURL (url: string): string {
  let newURL;
  if (/^https?:\/\//.test(url)) {
    newURL = new URL(window.__config.codec.decode(new URL(url).pathname.replace(new RegExp(`^${window.__config.prefix}`), "")));
  } else {
    newURL = new URL(window.__config.codec.decode(url.replace(new RegExp(`^${window.__config.prefix}`), "")));
  }
  return newURL.href;
}
