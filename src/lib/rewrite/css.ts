import rewriteURL from "./url";
let originURL: any;

export default function rewriteCSS (css: string, origin?: string): string {
  originURL = origin;

  return css.replace(/(?<=url\("?'?)[^"'][\S]*[^"'](?="?'?\);?)/g, rewriteCSSURL);
}

function rewriteCSSURL(match: string): string {
  let url = rewriteURL(match, originURL);
  return url;
}