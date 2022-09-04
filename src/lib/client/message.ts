import { WindowProxy } from "./window";

declare var __location: any;

export default class MessageProxy {
  constructor (scope: any) {
    return new Proxy(scope.addEventListener, {
      apply (target: any, thisArg: any, args: any[]): any {
        if (args[0] && args[1]) {
          if (args[0] === "message") {
            args[1] = new Proxy(args[1], {
              apply (target: any, thisArg: any, args: any[]): any {
                args[0] = new Proxy(args[0], {
                  get (target: any, prop: any, receiver: any): any {
                    if (prop === "origin") return __location.origin;
                    if (prop === "path") target[prop].map((win: Window) => new WindowProxy(win));
                    if (prop === "currentTarget") return new WindowProxy(target[prop]);
                    if (prop === "source") return new WindowProxy(target[prop]);
                    if (prop === "srcElement") return new WindowProxy(target[prop]);
                    if (prop === "target") return new WindowProxy(target[prop]);
                    return target[prop];
                  }
                });
                return Reflect.apply(target, thisArg, args);
              }
            });
          }
        }
        return Reflect.apply(target, thisArg, args);
      }
    });
  }
}