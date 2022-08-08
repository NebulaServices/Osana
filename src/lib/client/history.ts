const rewriteURL = self.__osana$bundle.rewrite.url;
const config = self.__osana$config;

const pushState = new Proxy(window.history.pushState, {
  apply (target: any, thisArg: any, args: string[]) {
    if (new RegExp(`^${config.prefix}`).test(args[2])) return;
    args[2] = rewriteURL(args[2]);
    Reflect.apply(target, thisArg, args);
  }
});

const replaceState = new Proxy(window.history.replaceState, {
  apply (target: any, thisArg: any, args: string[]) {
    if (new RegExp(`^${config.prefix}`).test(args[2])) return;
    args[2] = rewriteURL(args[2]);
    Reflect.apply(target, thisArg, args);
  }
});

export { pushState, replaceState };
