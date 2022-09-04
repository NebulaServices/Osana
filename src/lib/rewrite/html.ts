import { parse, serialize } from "parse5";
import rewriteURL from "./url";
import rewriteCSS from "./css";
import rewriteJS from "./js";

export default function rewriteHTML (html: string, origin?: string): string {
  return serialize(rewriteNode(parse(html), origin));
}

function rewriteNode (node: any, origin?: string): any {
  if (node.tagName) {
    for (let i in node.attrs) {
      if (node.attrs[i].name === "style") {
        node.attrs.push({ name: "data-style", value: node.attrs[i].value });
        node.attrs[i].value = rewriteCSS(node.attrs[i].value, origin);
      }
    }
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
        let src: boolean = false;
        for (let i in node.attrs) {
          if (node.attrs.includes({ name: "type", value: "application/json" })) {
            return;
          } else {
            if (node.attrs[i].name === "src") {
              node.attrs.push({ name: "data-src", value: node.attrs[i].value });
              node.attrs[i].value = rewriteURL(node.attrs[i].value, origin);
              src = true;
            } else if (node.attrs[i].name === "integrity") {
              node.attrs.push({ name: "data-integrity", value: node.attrs[i].value });
              node.attrs[i].value = "";
            } else if (node.attrs[i].name === "nonce") {
              node.attrs.push({ name: "data-nonce", value: node.attrs[i].value });
              node.attrs[i].value = "";
            }
          }
        }

        if (!src) {
          for (let i in node.childNodes) {
            node.childNodes[i].value = rewriteJS(node.childNodes[i].value, origin);
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
          } else if (node.attrs[i].name === "integrity") {
            node.attrs.push({ name: "data-integrity", value: node.attrs[i].value });
            node.attrs[i].value = "";
          } else if (node.attrs[i].name === "nonce") {
            node.attrs.push({ name: "data-nonce", value: node.attrs[i].value });
            node.attrs[i].value = "";
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
            node.attrs[i].value = rewriteSrcset(node.attrs[i].value, origin);
          }
        }
        break;

      case "source":
        for (let i in node.attrs) {
          if (node.attrs[i].name === "src") {
            node.attrs.push({ name: "data-src", value: node.attrs[i].value });
            node.attrs[i].value = rewriteURL(node.attrs[i].value, origin);
          } else if (node.attrs[i].name === "srcset") {
            node.attrs.push({ name: "data-srcset", value: node.attrs[i].value });
            node.attrs[i].value = rewriteSrcset(node.attrs[i].value, origin);
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
        break;

      case "area":
        for (let i in node.attrs) {
          if (node.attrs[i].name === "href") {
            node.attrs.push({ name: "data-href", value: node.attrs[i].value });
            node.attrs[i].value = rewriteURL(node.attrs[i].value, origin);
          } 
        }
        break;
      
      case "base":
        for (let i in node.attrs) {
          if (node.attrs[i].name === "href") {
            node.attrs.push({ name: "data-href", value: node.attrs[i].value });
            node.attrs[i].value = rewriteURL(node.attrs[i].value, origin);
          }
        }
        break;

      case "body":
        for (let i in node.attrs) {
          if (node.attrs[i].name === "background") {
            node.attrs.push({ name: "data-background", value: node.attrs[i].value });
            node.attrs[i].value = rewriteURL(node.attrs[i].value, origin);
          }
        }
        break;

      case "input":
        for (let i in node.attrs) {
          if (node.attrs[i].name === "src") {
            node.attrs.push({ name: "data-src", value: node.attrs[i].value });
            node.attrs[i].value = rewriteURL(node.attrs[i].value, origin);
          }
        }
        break;

      case "object":
        for (let i in node.attrs) {
          if (node.attrs[i].name === "data") {
            node.attrs.push({ name: "data-data", value: node.attrs[i].value });
            node.attrs[i].value = rewriteURL(node.attrs[i].value, origin);
          }
        }
        break;

      case "audio":
        for (let i in node.attrs) {
          if (node.attrs[i].name === "src") {
            node.attrs.push({ name: "data-src", value: node.attrs[i].value });
            node.attrs[i].value = rewriteURL(node.attrs[i].value, origin);
          }
        }
        break;

      case "button":
        for (let i in node.attrs) {
          if (node.attrs[i].name === "formaction") {
            node.attrs.push({ name: "data-formaction", value: node.attrs[i].value });
            node.attrs[i].value = rewriteURL(node.attrs[i].value, origin);
          }
        }
        break;

      case "embed":
        for (let i in node.attrs) {
          if (node.attrs[i].name === "src") {
            node.attrs.push({ name: "data-src", value: node.attrs[i].value });
            node.attrs[i].value = rewriteURL(node.attrs[i].value, origin);
          }
        }
        break;

      case "track":
        for (let i in node.attrs) {
          if (node.attrs[i].name === "src") {
            node.attrs.push({ name: "data-src", value: node.attrs[i].value });
            node.attrs[i].value = rewriteURL(node.attrs[i].value, origin);
          }
        }
        break;

      case "video":
        for (let i in node.attrs) {
          if (node.attrs[i].name === "src") {
            node.attrs.push({ name: "data-src", value: node.attrs[i].value });
            node.attrs[i].value = rewriteURL(node.attrs[i].value, origin);
          } else if (node.attrs[i].name === "poster") {
            node.attrs.push({ name: "data-poster", value: node.attrs[i].value });
            node.attrs[i].value = rewriteURL(node.attrs[i].value, origin);
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

export function rewriteSrcset (value: string, origin?: string): string {
  const urls = value.split(/ [0-9]+x,? ?/g);
  if (!urls) return "";
  const sufixes = value.match(/ [0-9]+x,? ?/g);
  if (!sufixes) return "";
  const rewrittenUrls = urls.map((url, i) => {
    if (url && sufixes[i]) return rewriteURL(url, origin) + sufixes[i];
  });
  return rewrittenUrls.join("");
}
