const config = self.__osana$config;

export function getLocation (scope?: any): Location | {} {
  try {
    let fakeLocation: any = new URL(config.codec.decode(location.pathname.replace(new RegExp(`^${config.prefix}`), "")));
    if (scope) {
      fakeLocation.href = new URL(config.codec.decode(scope.location.pathname.replace(new RegExp(`^${config.prefix}`), "")));
    }
    fakeLocation.ancestorOrigins = { length: 0 };
    fakeLocation.assign = (url: string) => location.assign(config.prefix + config.codec.encode(url));
    fakeLocation.reload = () => location.reload();
    fakeLocation.replace = (url: string) => location.replace(config.prefix + config.codec.encode(url));
    fakeLocation.toString = () => fakeLocation.href;
    return fakeLocation;
  } catch {
    return {};
  }
}

window.Location = class {} as any;

export class LocationProxy {
  constructor (scope?: any) {
    return new Proxy(new Location(), {
      get (target: any, prop: string, receiver: any): any {
        let fakeLocation: any = getLocation(scope);
        return fakeLocation[prop];
      },
      set (target: any, prop: string, value: any): any {
        let fakeLocation: any = getLocation(scope);
        fakeLocation[prop] = value;
        location.pathname = config.prefix + config.codec.encode(fakeLocation.href);
        return fakeLocation[prop];
      }
    });
  }
}

export default new LocationProxy() as any;
