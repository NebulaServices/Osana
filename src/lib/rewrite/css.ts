// import { parse, walk, generate } from "css-tree";
import rewriteURL from "./url";

export default function rewriteCSS (css: string, origin?: string): string {
  // const ast = parse(css);
  // walk(ast, (node) => {
  //   if (node.type === "Url") {
  //     node.value = rewriteURL(node.value as any, origin) as any;
  //   }
  // });
  // return generate(ast);

  css = css.replace(/(?<=url\("?'?)[^"'][\S]*[^"'](?="?'?\);?)/g, `${rewriteURL(`$&`)}`);
  css = css.replace(/(?<=--[\w\d-]*: "?'?)[^"' ].*[^"';](?="?'?;)/g, `${rewriteURL(`$&`)}`);
  return css;
}