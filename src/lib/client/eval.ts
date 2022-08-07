import rewriteJS from "../rewrite/js";

export default new Proxy(eval, {
  apply (target: typeof eval, thisArg: any, argumentsList: any[]): any {
    argumentsList[0] = rewriteJS(argumentsList[0]);
    return Reflect.apply(target, thisArg, argumentsList);
  }
});
