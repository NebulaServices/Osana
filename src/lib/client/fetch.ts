const rewriteURL = self.__osana$bundle.rewrite.url;

export default new Proxy(fetch, {
  apply (target, thisArg, args) {
    if (args[0]) args[0] = rewriteURL(args[0]);
    return Reflect.apply(target, thisArg, args);
  }
});
