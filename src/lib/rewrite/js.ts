import { parse } from "acorn";
import { full } from "acorn-walk";
import { generate } from "escodegen";

export default function rewriteJS (js: string): string {
  let output: string = js;
  full(parse(js, {
    sourceType: "module"
  } as any), (node: any) => {
    if (node.type === "Identifier") {
      switch (node.name) {
        case "self":
          node.name = "__self";
          break;
        case "window":
          node.name = "__window";
          break;
        case "location":
          node.name = "__location";
          break;
        case "parent":
          node.name = "__parent";
          break;
        case "localStorage":
          node.name = "__localStorage";
          break;
        case "sessionStorage":
          node.name = "__sessionStorage";
          break;
      }
    }

    if (node.type === "Program") {
      output = generate(node);
    }
  });
  return output;
}
