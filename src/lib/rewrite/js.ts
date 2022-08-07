import * as acorn from "acorn";
import escodegen from "escodegen";

export default function rewriteJS (js: string): string {
  let AST: acorn.Node = getAST(js);
  AST = walkAST(AST, null, (node: any, parent: any) => {
    if (node.type === "MemberExpression") {
      if (parent.type !== "CallExpression") {
        node.object = rewriteNode(node.object);
      } else if (node.object.type === "Identifier") {
        if (["location", "localStorage", "sessionStorage"].includes(node.object.name)) {
          node.object = rewriteNode(node.object);
        }
      }
    }
    // if (node.type === "Identifier") {
    //   if (node.name !== "window") {
    //     if (parent.type !== "MemberExpression") {
    //       node = rewriteNode(node);
    //     }
    //   }
    // }
    return node;
  });
  return escodegen.generate(AST);
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
    }
  }
  return node;
}

function walkAST (AST: any, parent: any, handler: (node: any, parent: any) => any): acorn.Node {
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

function getAST (js: string): acorn.Node {
  try {
    return acorn.parse(js, {
//ecmaVersion: 2020
    } as any);
  } catch {
    return acorn.parse(js, {
      //ecmaVersion: 2020,
      sourceType: "module"
    } as any);
  }
}
