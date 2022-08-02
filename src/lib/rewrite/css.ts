import * as CSS from "./css/index";
import rewriteURL from "./url";

export default function rewriteCSS (css: string, origin?: string): string {
  try {
    const data = CSS.parse(css);

    for (let i in data.stylesheet.rules) {
      const rule = data.stylesheet.rules[i];
      if (rule.declarations) {
        for (let j in rule.declarations) {
          const declaration = rule.declarations[j];
          if (declaration.type === "declaration") {
            if (/url\(['"]?(https?:)?\/\/.*['"]?\)/i.test(declaration.value)) {
              data.stylesheet.rules[i].declarations[j].value = declaration.value.replace(/[^url('"]+.+?[^'")]+/, (url: string) => {
                return rewriteURL(url, origin);
              });
            }
          }
        }
      }
    }
  
    return CSS.stringify(data);
  } catch (e) {
    console.error(e);
    return css;
  }
}
