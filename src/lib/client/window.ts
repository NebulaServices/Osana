import { LocationProxy } from "./location";

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
          if (window === window[prop as any]) return window.__window; 
          else return new WindowProxy(target[prop as any]);
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
