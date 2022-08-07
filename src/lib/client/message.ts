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
                  get (target: any, property: any, receiver: any): any {
                    if (property === "origin") return __location.origin;
                    if (property === "path") target[property].map((win: Window) => new WindowProxy(win));
                    if (property === "currentTarget") return new WindowProxy(target[property]);
                    if (property === "source") return new WindowProxy(target[property]);
                    if (property === "srcElement") return new WindowProxy(target[property]);
                    if (property === "target") return new WindowProxy(target[property]);
                    return target[property];
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
