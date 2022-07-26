import rewriteURL from "../rewrite/url";
import config from "../../config";

export default new Proxy(Request, {
  construct (target, args) {
    if (args[0]) args[0] = rewriteURL(args[0]);
    return new Proxy(Reflect.construct(target, args), {
      get (target: any, prop: string, receiver: any): any {
        if (prop === "url") {
          let fakeLocation: any = new URL(config.codec.decode(location.pathname.replace(new RegExp(`^${config.prefix}`), "")));
          return fakeLocation.href;
        }
        return target[prop];
      }
    });
  }
});