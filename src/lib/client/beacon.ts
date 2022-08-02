import rewriteURL from "../rewrite/url";

export default new Proxy(navigator.sendBeacon, {
  apply (target, thisArg, args) {
    if (args[0]) args[0] = rewriteURL(args[0]);
    return Reflect.apply(target, thisArg, args);
  }
});
