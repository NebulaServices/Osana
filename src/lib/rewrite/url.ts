import rewriteJS from './js';

export default function rewriteURL (url: string, origin?: string): string {
  const config = self.__osana$config;
  if (new RegExp(`^${config.prefix}`).test(url)) return url;
  let fakeLocation: URL;

  if ("window" in self) {
    fakeLocation = new URL(config.codec.decode(location.href.slice((location.origin + config.prefix).length)));
  }

  if (origin) {
    fakeLocation = new URL(origin);
  }

  if (/^(#|about|data|mailto):/.test(url)) {
    return url;
  } else if (/^javascript:/.test(url)) {
    return `javascript:${rewriteJS(url.slice('javascript:'.length), origin)}`;
  } else {
    if (!fakeLocation) return url;
    try {
      return `${config.prefix}${config.codec.encode(new URL(url, fakeLocation).href)}`;
    } catch {
      return `${config.prefix}${config.codec.encode(url)}`
    }
  }
}

export function unwriteURL (url: string): string {
  const config = self.__osana$config;
  if (!url) return url;
  let newURL: URL;
  if (/^https?:\/\//.test(url)) {
    newURL = new URL(config.codec.decode(new URL(url).pathname.slice(config.prefix.length)));
  } else {
    newURL = new URL(config.codec.decode(url.slice(config.prefix.length)));
  }
  return newURL.href;
}
