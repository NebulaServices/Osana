import { LocationProxy } from "./location";

// FIXME: for(;__window !== __window.parent;) {
// FIXME:   if (__window.parent.location.href) {
// FIXME:     __window = __window.parent;
// FIXME:   }
// FIXME: }


export class WindowProxy {
  constructor (scope: Window) {
    return new Proxy(scope, {
      get (target: any, prop: string, receiver: any): any {
        if (typeof target[prop] === "function") {
          return (...args: any[]) => {
            return target[prop].call(window, ...args);
          }
        }
        if (prop === "location") {
          return new LocationProxy(target);
        }
        if (["parent", "top"].includes(prop)) {
        //  return new WindowProxy(target[prop]);
        }
        if (["window", "self", "globalThis"].includes(prop)) {
          return new WindowProxy(target);
        }
        return target[prop];
      }
    });
  }
}

export default new WindowProxy(window) as any;
