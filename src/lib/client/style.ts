const properties = ["background", "background-image", "list-style", "list-style-image", "cursor", "border-image", "mask", "mask-image"]

CSSStyleDeclaration.prototype.setProperty = new Proxy(CSSStyleDeclaration.prototype.setProperty, {
  apply(t, g, a) {
    if (a[3] === "important") {
      return Reflect.apply(t, g, a);
    }

    if (properties.includes(a[0])) {
      // i have to use self.__osana$bundle or whatever cuz if i use rewriteCSS name it'll conflict with element.ts
      return Reflect.apply(t, g, [a[0], self.__osana$bundle.rewrite.css(a[1])]);
    }
  }
});

const cssText = Object.getOwnPropertyDescriptor(CSSStyleDeclaration.prototype, "cssText");
Object.defineProperty(CSSStyleDeclaration.prototype, "cssText", {
  set (value) {
    return cssText.set.call(this, self.__osana$bundle.rewrite.css(value));
  },
});