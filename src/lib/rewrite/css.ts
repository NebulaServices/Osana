// import { parse, walk, generate } from "css-tree";
import rewriteURL from "./url";
let originURL: any;

export default function rewriteCSS (css: string, origin?: string): string {
  originURL = origin;
  // const ast = parse(css);
  // walk(ast, (node) => {
  //   if (node.type === "Url") {
  //     node.value = rewriteURL(node.value as any, origin) as any;
  //   }
  // });
  // return generate(ast);
  // /(?<=url\("?'?)[^"'][\S]*[^"'](?="?'?\);?)/g

  return css.replace(/(?<=url\("?'?)[^"'][\S]*[^"'](?="?'?\);?)/g, rewriteCSSURL);
}

function rewriteCSSURL(match: string): string {
  let url = rewriteURL(match, originURL);
  return url;
}