import { LocationProxy } from "./location";

export class WindowProxy {
  constructor (scope: Window) {
    return new Proxy(scope, {
      get (target: any, prop: string, receiver: any): any {
        let exclusions = [
          "Symbol",
          "Number",
          "setTimeout",
          "setInterval",
          "parseFloat",
          "parseInt",
          "fetch"
        ];
        if (target[prop] && target[prop].toString && typeof target[prop] === "function" && /{ \[native code\] }/.test(target[prop].toString()) && !exclusions.includes(prop)) {
          if (isFunction(target[prop]) === "class") {
            return class extends target[prop] {
              constructor (...args: any[]) {
                super(...args);
              }
            }
          } else {
            return function () {
              return (scope[prop as any] as any).apply(window, arguments);
            }
          }
        } else if (prop === "location") {
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
        return scope[prop as any] = value;
      }
    });
  }
}

// https://stackoverflow.com/a/69316645/14635947/
function isFunction(x: any): string {
  return typeof x === 'function'
    ? x.prototype
      ? Object.getOwnPropertyDescriptor(x, 'prototype').writable
        ? 'function'
        : 'class'
    : x.constructor.name === 'AsyncFunction'
    ? 'async'
    : 'arrow'
  : '';
}

export default new WindowProxy(window) as any;
