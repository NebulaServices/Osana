import * as csstree from "css-tree";
import rewriteURL from "./url";

export default function rewriteCSS (css: string, origin?: string): string {
  const ast = csstree.parse(css);
  csstree.walk(ast, (node) => {
    if (node.type === "Url") {
      node.value = rewriteURL(node.value as any, origin) as any;
    }
  });
  return csstree.generate(ast);
}
