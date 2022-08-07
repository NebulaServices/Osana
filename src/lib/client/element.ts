import rewriteURL, { unwriteURL } from "../rewrite/url";
import rewriteCSS from "../rewrite/css";
import rewriteJS from "../rewrite/js";

const attributes: {[index: string]: any} = {
  "innerHTML": [ HTMLScriptElement, HTMLStyleElement ],
  "href": [ HTMLAnchorElement, HTMLLinkElement, HTMLAreaElement, HTMLBaseElement ],
  "src": [ HTMLAudioElement, HTMLEmbedElement, HTMLIFrameElement, HTMLImageElement, HTMLInputElement, HTMLScriptElement, HTMLSourceElement, HTMLTrackElement, HTMLVideoElement ],
  "srcset": [ HTMLImageElement, HTMLSourceElement ],
  "action": [ HTMLFormElement ] 
}

const setterApply = (Object.getOwnPropertyDescriptor(Element.prototype, "setAttribute") as any).value;
// const getterApply = (Object.getOwnPropertyDescriptor(Element.prototype, "getAttribute") as any).value;
Element.prototype.setAttribute = function (name: string, value: string): void {
  if (attributes[name]) {
    for (let i in attributes[name]) {
      if ((this as any) instanceof attributes[name][i]) {
        setterApply.apply(this, [name, rewriteURL(value)]);
        return;
      }
    }
  }
  if (name === undefined || value === undefined) throw new TypeError(`Failed to execute 'setAttribute' on 'Element': 2 arguments required, but only ${!name && !value ? 0 : 1} present.`);
  setterApply.apply(this, [name, value]);
}

// Element.prototype.getAttribute = function (name: string): string {
//   if (attributes[name]) {
//     for (let i in attributes[name]) {
//       if ((this as any) instanceof attributes[name][i]) {
//         return unwriteURL(getterApply.apply(this, [name]));
//       }
//     }
//   }
//   if(name === undefined) throw new TypeError("Failed to execute 'getAttribute' on 'Element': 1 argument required, but only 0 present.");
//   return getterApply.apply(this, [name]);
// }


Object.keys(attributes).forEach((attribute) => {
  attributes[attribute].forEach((element: any) => {
    try {
      // URL based attributes
      if (["href", "src", "srcset", "action"].includes(attribute)) {
        const { set, get } = Object.getOwnPropertyDescriptor(element.prototype, attribute) as any;
        Object.defineProperty(element.prototype, attribute, {
          // get() {
          //   const value = get.call(this);
          //   return unwriteURL(value);
          // },
          set (value) {
            return set.call(this, [ rewriteURL(value) ]);
          }
        });
      } else if (["innerHTML"].includes(attribute)) {
        if (element instanceof HTMLScriptElement) {
          const { set } = Object.getOwnPropertyDescriptor((element as any).prototype, attribute) as any;
          Object.defineProperty((element as any).prototype, attribute, {
            set (value) {
              return set.call(this, rewriteJS(value));
            }
          });
        } else if (element instanceof HTMLStyleElement) {
          const { set } = Object.getOwnPropertyDescriptor((element as any).prototype, attribute) as any;
          Object.defineProperty((element as any).prototype, attribute, {
            set (value) {
              return set.call(this, rewriteCSS(value));
            }
          });
        }
      }
    } catch {}
  });
});
