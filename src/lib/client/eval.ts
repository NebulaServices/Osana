const rewriteJS = self.__osana$bundle.rewrite.js;

export default new Proxy(eval, {
  apply (target: typeof eval, thisArg: any, argumentsList: any[]): any {
    if (argumentsList[0]) argumentsList[0] = rewriteJS(argumentsList[0]);
    return Reflect.apply(target, thisArg, argumentsList);
  }
});
