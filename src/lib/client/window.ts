import { LocationProxy } from "./location";

export class WindowProxy {
  constructor (scope: Window) {
    return new Proxy(scope, {
      get (target: any, prop: string, receiver: any): any {
        if (target[prop] && target[prop].toString && typeof target[prop] === "function" && /{ \[native code\] }/.test(target[prop].toString()) && prop !== "Symbol") {
          // return a function that can also be called with the new operator
          if (isFunction(target[prop]) === "class") {
            return class extends target[prop] {
              constructor (...args: any[]) {
                super(...args);
              }
            }
          } else {
            return function () {
              return target[prop].apply(window, arguments);
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
