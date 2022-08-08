import locationProxy from "./location";

const encodeProtocol = self.__osana$bundle.rewrite.protocol;
const v4 = self.__osana$bundle.uuid;
const config = self.__osana$config;

const websockets = new Map();

export default new Proxy(WebSocket, {
  construct (target: any, args: any[], newTarget: any): any {
    if (args[0]) {
      const url = new URL(args[0]);
      const id = v4();
  
      websockets.set(id, url.toString());
    
      const request = {
        remote: {
          host: url.hostname,
          port: url.port || (url.protocol === "wss:" ? "443" : "80"),
          path: url.pathname + url.search,
          protocol: url.protocol
        },
        headers: {
          Host: url.host,
          Origin: locationProxy.origin,
          Pragma: "no-cache",
          "Cache-Control": "no-cache",
          Upgrade: "websocket",
          Connection: "Upgrade"
        },
        forward_headers: ["accept-encoding", "accept-language", "sec-websocket-extensions", "sec-websocket-key", "sec-websocket-version"]
      };
    
      const bareURL = new URL(config.bare);
      return Reflect.construct(target, [ location.protocol.replace("http", "ws") + "//" + (bareURL.host + bareURL.pathname) + `v1/?${id}`, [ "bare", encodeProtocol(JSON.stringify(request)) ] ]);
    }
    return Reflect.construct(target, args, newTarget);
  }
});

const websocketURL = Object.getOwnPropertyDescriptor(WebSocket.prototype, "url");

Object.defineProperty(WebSocket.prototype, "url", {
  get () {
    const url = websocketURL.get.call(this);
    const id = new URL(url).search.substring(1);
    return websockets.get(id);
  }
});
