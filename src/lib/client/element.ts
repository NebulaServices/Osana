const rewriteURL = self.__osana$bundle.rewrite.url;
const rewriteCSS = self.__osana$bundle.rewrite.css;
const rewriteJS = self.__osana$bundle.rewrite.js;
const rewriteHTML = self.__osana$bundle.rewrite.html;
const rewriteSrcset = self.__osana$bundle.rewrite.srcset;

const attributes: {[index: string]: any} = {
  "href": [ HTMLAnchorElement, HTMLLinkElement, HTMLAreaElement, HTMLBaseElement ],
  "src": [ HTMLAudioElement, HTMLEmbedElement, HTMLIFrameElement, HTMLImageElement, HTMLInputElement, HTMLScriptElement, HTMLSourceElement, HTMLTrackElement, HTMLVideoElement ],
  "srcset": [ HTMLImageElement, HTMLSourceElement ],
  "action": [ HTMLFormElement ] 
}

// Element.seAttribute
const setterApply = (Object.getOwnPropertyDescriptor(Element.prototype, "setAttribute") as any).value;
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

// Element[attribute]
Object.keys(attributes).forEach((attribute) => {
  attributes[attribute].forEach((element: any) => {
    try {
      // URL based attributes
      if (["href", "src", "srcset", "action"].includes(attribute)) {
        const { set, get } = Object.getOwnPropertyDescriptor(element.prototype, attribute) as any;
        Object.defineProperty(element.prototype, attribute, {
          set (value) {
            return set.call(this, [ rewriteURL(value) ]);
          }
        });
      }
    } catch {}
  });
});

// Element.innerHTML
const { set } = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML") as any;
Object.defineProperty(Element.prototype, "innerHTML", {
  set (value) {
    if (this instanceof HTMLScriptElement) {
      return set.call(this, rewriteJS(value));
    } else if (this instanceof HTMLStyleElement) {
      return set.call(this, rewriteCSS(value));
    }
    return set.call(this, rewriteHTML(value));
  }
});
