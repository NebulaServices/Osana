const properties = {
  "background": "background",
  "backgroundImage": "background-image",
  "listStyle": "list-style",
  "listStyleImage": "list-style-image",
  "cursor": "cursor",
  "borderImage": "border-image",
  "mask": "mask",
  "maskImage": "mask-image"
};

CSSStyleDeclaration.prototype.setProperty = new Proxy(CSSStyleDeclaration.prototype.setProperty, {
  apply(t, g, a) {
    if (a[2] === "important" || !a[1]) {
      return Reflect.apply(t, g, a);
    }

    if (Object.values(properties).includes(a[0])) {
      // i have to use self.__osana$bundle or whatever cuz if i use rewriteCSS name it'll conflict with element.ts
      return Reflect.apply(t, g, [a[0], self.__osana$bundle.rewrite.css(a[1])]);
    }
  }
});

// this entire thing needs to be fixed idk why it doesn't work
// Object.keys(properties).forEach((attr: any) => {
//   try {
//     const property = Object.getOwnPropertyDescriptor(CSSStyleDeclaration.prototype, attr) as any;
//     Object.defineProperty(CSSStyleDeclaration.prototype, attr, {
//       get () {
//         return property.get.call(this);
//       },
//       set (value) {
//         return property.set.call(this, self.__osana$bundle.rewrite.css(value));
//       }
//     });
//   } catch (err) {
//     if (err) throw err;
//   }
// });

const cssText = Object.getOwnPropertyDescriptor(CSSStyleDeclaration.prototype, "cssText");
Object.defineProperty(CSSStyleDeclaration.prototype, "cssText", {
  set (value) {
    return cssText.set.call(this, self.__osana$bundle.rewrite.css(value));
  },
});