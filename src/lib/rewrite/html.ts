import { parse, serialize } from "parse5";
import rewriteNode from "./node";

export default function rewriteHTML (html: string, origin?: string): string {
  return serialize(rewriteNode(parse(html), origin));
}
