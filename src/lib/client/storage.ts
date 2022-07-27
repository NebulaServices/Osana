import LocationProxy from "./location";

function createStorageProxy (scope: Storage) {
  return new Proxy({
    getItem (key: string): string {
      return scope.getItem(`${key}@${LocationProxy.host}`);
    },
    setItem (key: string, value: string): void {
      scope.setItem(`${key}@${LocationProxy.host}`, value);
    },
    removeItem (key: string): void {
      scope.removeItem(`${key}@${LocationProxy.host}`);
    },
    clear (): void {
      Object.keys(scope).forEach((key) => {
        if (new RegExp(`@${LocationProxy.host}$`).test(key)) {
          (this as any).removeItem(key.replace(new RegExp(`@${LocationProxy.host}$`), ""));
        }
      });
    }
  }, {
    get (target: any, prop: string, receiver: any): string | number | Function {
      if (prop === "length") {
        return Object.keys(scope).filter((key) => new RegExp(`@${LocationProxy.host}$`).test(key)).length;
      } else if (["getItem", "setItem", "removeItem", "clear"].includes(prop)) {
        return target[prop];
      } else {
        return target.getItem(prop);
      }
    },
    set (target: any, prop: string, value: any): boolean {
      return target.setItem(prop, value);
    }
  });
}

const idbopen = indexedDB.open;
indexedDB.open = (name: string, version?: number): IDBOpenDBRequest => {
  return idbopen.call(indexedDB, `${name}@${LocationProxy.host}`, version);
}

declare let openDatabase: any;

if (openDatabase) {
  const odb = openDatabase;
  openDatabase = (name: string, version: string, displayName: string, maxSize: number): any => {
    return odb(`${name}@${LocationProxy.host}`, version, displayName, maxSize);
  }
}

window.__localStorage = createStorageProxy(localStorage);
window.__sessionStorage = createStorageProxy(sessionStorage);
