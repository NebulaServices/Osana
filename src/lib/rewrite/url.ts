import rewriteJS from './js';

function combine (url: URL, path: string) {
  if (!url.pathname) return path;
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
  const config = self.__osana$config;
  if (new RegExp(`^${config.prefix}`).test(url)) return url;
  let fakeLocation;
  if ("window" in self) {
    fakeLocation = new URL(config.codec.decode(location.pathname.replace(new RegExp(`^${config.prefix}`), "")));
  }
  if (origin) {
    fakeLocation = new URL(origin);
  }

  if (/^(#|about|data|mailto):/.test(url)) {
    return url;
  } else if (/^javascript:/.test(url)) {
    return `javascript:${rewriteJS(url.slice('javascript:'.length))}`;
  } else {
    if (!fakeLocation) return url;
    try {
      return `${config.prefix}${config.codec.encode(new URL(url, fakeLocation.href).href)}`;
    } catch {
      return `${config.prefix}${config.codec.encode(url)}`
    }
  }
}

export function unwriteURL (url: string): string {
  const config = self.__osana$config;
  if(!url) return url;
  let newURL;
  if (/^https?:\/\//.test(url)) {
    newURL = new URL(config.codec.decode(new URL(url).pathname.replace(new RegExp(`^${config.prefix}`), "")));
  } else {
    newURL = new URL(config.codec.decode(url.replace(new RegExp(`^${config.prefix}`), "")));
  }
  return newURL.href;
}
