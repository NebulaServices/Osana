import { LocationProxy } from "./location";

export class WindowProxy {
  constructor (scope: Window) {
    return new Proxy(scope, {
      get (target: any, prop: string, receiver: any): any {
        if (prop === "location") {
          return new LocationProxy(target);
        } else if (["parent", "top"].includes(prop)) {
          if (window === window[prop as any]) return window.__window; 
          else return new WindowProxy(target[prop as any]);
        } else if (["window", "self", "globalThis"].includes(prop)) {
          return new WindowProxy(target);
        } else if (prop === "localStorage") {
          return window.__localStorage;
        } else if (prop === "sessionStorage") {
          return window.__sessionStorage;
        }
        return target[prop];
      },
      set (target: any, prop: string, value: any): any {
        return Reflect.set(scope, prop, value);
      }
    });
  }
}

export default new WindowProxy(window) as any;
