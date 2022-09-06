const rewriteURL = self.__osana$bundle.rewrite.url.rewriteURL;
const unwriteURL = self.__osana$bundle.rewrite.url.unwriteURL;
const rewriteCSS = self.__osana$bundle.rewrite.css;
const rewriteJS = self.__osana$bundle.rewrite.js;
const rewriteHTML = self.__osana$bundle.rewrite.html;
const rewriteSrcset = self.__osana$bundle.rewrite.srcset;

const attributes: {[index: string]: any} = {
  "href": [ HTMLAnchorElement, HTMLLinkElement, HTMLAreaElement, HTMLBaseElement ],
  "src": [ HTMLAudioElement, HTMLEmbedElement, HTMLIFrameElement, HTMLImageElement, HTMLInputElement, HTMLScriptElement, HTMLSourceElement, HTMLTrackElement, HTMLVideoElement ],
  "srcset": [ HTMLImageElement, HTMLSourceElement ],
  "action": [ HTMLFormElement ],
  "poster": [ HTMLVideoElement ],
  "formaction": [ HTMLButtonElement ],
  "data": [ HTMLObjectElement ],
  "background": [ HTMLBodyElement ],
  "integrity": [ HTMLScriptElement, HTMLLinkElement ],
  "nonce": [ HTMLElement ]
}

// Element.setAttribute
// const setterApply = (Object.getOwnPropertyDescriptor(Element.prototype, "setAttribute") as any).value;
// Element.prototype.setAttribute = function (name: string, value: string): void {
//   if (attributes[name]) {
//     for (let i in attributes[name]) {
//       if ((this as any) instanceof attributes[name][i]) {
//         setterApply.apply(this, [name, rewriteURL(value)]);
//         return;
//       }
//     }
//   }
//   if (name === undefined || value === undefined) throw new TypeError(`Failed to execute 'setAttribute' on 'Element': 2 arguments required, but only ${!name && !value ? 0 : 1} present.`);
//   setterApply.apply(this, [name, value]);
// }

HTMLElement.prototype.setAttribute = new Proxy(HTMLElement.prototype.setAttribute, {
  apply (t: any, g: any, a: any[]) {
    if (a[0].toLowerCase() === "integrity" || a[0].toLowerCase() === "nonce") {
      g.dataset[`osana_${a[0].toLowerCase}`] = a[0].toLowerCase();
    } else if (attributes[a[0].toLowerCase()]) {
      if (a[0].toLowerCase() === "style") {
        g.dataset["osana_style"];
        a[1] = rewriteCSS(a[1]);
      } else if (a[0].toLowerCase() === "srcset") {
        g.dataset["osana_srcset"];
        a[1] = rewriteSrcset(a[1]);
      } else {
        g.dataset[`osana_${a[0].toLowerCase()}`];
        a[1] = rewriteURL(a[1]);
      }
    }

    return Reflect.apply(t, g, a);
  }
});

// TODO: make the getAttribute proxy

// Element[attribute]
Object.keys(attributes).forEach((attribute) => {
  attributes[attribute].forEach((element: any) => {
    try {
      const attr = Object.getOwnPropertyDescriptor(element.prototype, attribute);
      if (attribute !== "srcset") {
        Object.defineProperty(element.prototype, attribute, {
          get () {
            return attr.get.call(this, this.dataset[`osana_${attribute}`]);
          },
          set (value) {
            if (attribute === "integrity" || attribute === "nonce") {
              this.dataset[`osana_${attribute}`] = value;
              return this.removeAttribute(attribute);
            } else {
              this.dataset[`osana_${attribute}`] = value;
              return attr.set.call(this, rewriteURL(value));
            }
          }
        });
      } else {
        Object.defineProperty(element.prototype, attribute, {
          get () {
            return attr.get.call(this, this.dataset[`osana_${attribute}`]);
          },
          set (value) {
            this.dataset[`osana_${attribute}`] = value;
            return attr.set.call(this, rewriteSrcset(value));
          },
        });
      }
    } catch (err) {
      if (err) throw err;
    }
  });
})

// Element.innerHTML
const innerHTML = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML") as any;
Object.defineProperty(HTMLElement.prototype, "innerHTML", {
  set (value) {
    if (this instanceof HTMLScriptElement) {
      return innerHTML.set.call(this, rewriteJS(value));
    } else if (this instanceof HTMLStyleElement) {
      return innerHTML.set.call(this, rewriteCSS(value));
    }
    return innerHTML.set.call(this, rewriteHTML(value));
  }
});
