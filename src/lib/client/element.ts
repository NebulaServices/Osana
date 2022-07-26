import rewriteURL, { unwriteURL } from "../rewrite/url";

const attributes: {[index: string]: any} = {
  "href": [ HTMLAnchorElement, HTMLLinkElement, HTMLAreaElement, HTMLBaseElement ],
  "src": [ HTMLAudioElement, HTMLEmbedElement, HTMLIFrameElement, HTMLImageElement, HTMLInputElement, HTMLScriptElement, HTMLSourceElement, HTMLTrackElement, HTMLVideoElement ],
  "srcset": [ HTMLImageElement, HTMLSourceElement ],
  "action": [ HTMLFormElement ] 
}

Object.keys(attributes).forEach((attribute) => {
  attributes[attribute].forEach((element: any) => {
    try {
      // URL based attributes
      if (["href", "src", "srcset", "action"].includes(attribute)) {
        const { set, get } = Object.getOwnPropertyDescriptor(element.prototype, attribute);
        Object.defineProperty(element.prototype, attribute, {
          get() {
            const value = get.call(this);
            return unwriteURL(value);
          },
          set (value) {
            return set.call(this, [ rewriteURL(value) ]);
          }
        });
      }
    } catch {}
  });
});
