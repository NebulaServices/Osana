const rewriteURL = self.__osana$bundle.rewrite.url;

export default new Proxy(window.Worker, {
  construct (target: any, args: any[], newTarget: any): any {
    if (args[0]) args[0] = rewriteURL(args[0]);
    return Reflect.construct(target, args, newTarget);
  }
});
