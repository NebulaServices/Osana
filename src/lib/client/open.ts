import rewriteURL from "../rewrite/url";

export default new Proxy(window.open, {
  apply (target: any, thisArg: any, args: any[]): any {
    if (args[0] && args[0] !== "about:blank") {
      args[0] = rewriteURL(args[0]);
    }
    Reflect.apply(target, thisArg, args);
  }
});
