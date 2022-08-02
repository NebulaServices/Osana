import rewriteURL from "../rewrite/url";

const pushState = new Proxy(window.history.pushState, {
  apply (target: any, thisArg: any, args: string[]) {
    args[2] = rewriteURL(args[2]);
    Reflect.apply(target, thisArg, args);
  }
});

const replaceState = new Proxy(window.history.replaceState, {
  apply (target: any, thisArg: any, args: string[]) {
    console.log(new Error().stack);
    args[2] = rewriteURL(args[2]);
    Reflect.apply(target, thisArg, args);
  }
});

export { pushState, replaceState };
