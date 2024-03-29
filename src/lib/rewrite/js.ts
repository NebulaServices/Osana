import { parseScript } from "meriyah";
import { generate } from "esotope-hammerhead";
import rewriteURL from "./url";

export default function rewriteJS (js: string, origin?: string): string {
  let AST: any = getAST(js);
  AST = walkAST(AST, null, (node: any, parent: any) => {
    if (node.type === "MemberExpression") {
      if (parent.type !== "CallExpression") {
        node.object = rewriteNode(node.object);
      } else if (node.object.type === "Identifier") {
        if (["location", "localStorage", "sessionStorage"].includes(node.object.name)) {
          node.object = rewriteNode(node.object);
        }
      }
    } else if (node.type === "Literal" && (parent.type === "ImportDeclaration" || parent.type === "ImportExpression" || parent.type === "ExportNamedDeclaration" || parent.type === "ExportAllDeclaration")) {
      node.value = rewriteURL(node.value, origin);
    }
    
    return node;
  });

  return generate(AST, {
    format: {
      quotes: 'double'
    }
  });
}

function rewriteNode (node: any): any {
  if (node.type === "Identifier") {
    switch (node.name) {
      case "self":
        node.name = "__self";
        break;
      case "window":
        node.name = "__window";
        break;
      case "parent":
        node.name = "__parent";
        break;
      case "location":
        node.name = "__location";
        break;
      case "localStorage":
        node.name = "__localStorage";
        break;
      case "sessionStorage":
        node.name = "__sessionStorage";
        break;
      case "top":
        node.name = "__top";
        break;
    }
  }
  return node;
}

function walkAST (AST: any, parent: any, handler: (node: any, parent: any) => any): any {
  if (!AST || typeof AST !== "object") return AST;
  AST = handler(AST, parent);
  for (let node in AST) {
    if (Array.isArray(AST[node])) {
      for (let n in AST[node]) {
        AST[node][n] = walkAST(AST[node][n], AST[node], handler);
      }
    } else {
      AST[node] = walkAST(AST[node], AST, handler);
    }
  }
  return AST;
}

function getAST (js: string): any {
  try {
    return parseScript(js, {
      module: true
    });
  } catch (err) {
    console.error(err);
    return parseScript("");
  }
}