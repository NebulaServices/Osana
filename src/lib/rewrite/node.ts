import rewriteURL from "./url";
import rewriteCSS from "./css";

export default function rewriteNode (node: any, origin?: string): any {
  if (node.tagName) {
    switch (node.tagName.toLowerCase()) {
      case "a":
        for (let i in node.attrs) {
          if (node.attrs[i].name === "href") {
            node.attrs.push({ name: "data-href", value: node.attrs[i].value });
            node.attrs[i].value = rewriteURL(node.attrs[i].value, origin);
          }
        }
        break;

      case "script":
        for (let i in node.attrs) {
          if (node.attrs[i].name === "src") {
            node.attrs.push({ name: "data-src", value: node.attrs[i].value });
            node.attrs[i].value = rewriteURL(node.attrs[i].value, origin);
          } else if (node.attrs[i].name === "integrity") {
            node.attrs.push({ name: "data-integrity", value: node.attrs[i].value });
            node.attrs[i].value = "";
          } else if (node.attrs[i].name === "nonce") {
            node.attrs.push({ name: "data-nonce", value: node.attrs[i].value });
            node.attrs[i].value = "";
          }
        }
        break;
      
      case "style":
        for (let i in node.attrs) {
          if (node.attrs[i].name === "integrity") {
            node.attrs.push({ name: "data-integrity", value: node.attrs[i].value });
            node.attrs[i].value = "";
          } else if (node.attrs[i].name === "nonce") {
            node.attrs.push({ name: "data-nonce", value: node.attrs[i].value });
            node.attrs[i].value = "";
          }
        }
        for (let i in node.childNodes) {
          node.childNodes[i].value = rewriteCSS(node.childNodes[i].value, origin);
        }
        break;

      case "link":
        for (let i in node.attrs) {
          if (node.attrs[i].name === "href") {
            node.attrs.push({ name: "data-href", value: node.attrs[i].value });
            node.attrs[i].value = rewriteURL(node.attrs[i].value, origin);
          }
        }
        break;
      
      case "img":
        for (let i in node.attrs) {
          if (node.attrs[i].name === "src") {
            node.attrs.push({ name: "data-src", value: node.attrs[i].value });
            node.attrs[i].value = rewriteURL(node.attrs[i].value, origin);
          } else if (node.attrs[i].name === "srcset") {
            node.attrs.push({ name: "data-srcset", value: node.attrs[i].value });
            node.attrs[i].value = "";
          }
        }
        break;

      case "form":
        for (let i in node.attrs) {
          if (node.attrs[i].name === "action") {
            node.attrs.push({ name: "data-action", value: node.attrs[i].value });
            node.attrs[i].value = rewriteURL(node.attrs[i].value, origin);
          }
        }
        break;

      case "iframe":
        for (let i in node.attrs) {
          if (node.attrs[i].name === "src") {
            node.attrs.push({ name: "data-src", value: node.attrs[i].value });
            node.attrs[i].value = rewriteURL(node.attrs[i].value, origin);
          }
        }
        break;

      case "meta":
        for (let i in node.attrs) {
          if (node.attrs[i].name === "http-equiv") {
            if (node.attrs[i].value === "Content-Security-Policy") {
              node.attrs.push({ name: "data-Content-Security-Policy", value: node.attrs[i].value });
              node.attrs[i].value = "*";
            }
            for (let i in node.attrs) {
              if (node.attrs[i].name === "content") {
                node.attrs.push({ name: "data-content", value: node.attrs[i].value });
                node.attrs[i].value = "";
              }
            }
          }
        }
    }
  }

  if (node.childNodes) {
    for (let childNode in node.childNodes) {
      childNode = rewriteNode(node.childNodes[childNode], origin);
    }
  }

  return node;
}
