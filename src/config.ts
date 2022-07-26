import * as codec from "./lib/util/codecs";

declare global {
  interface Window {
    __config: any;
  }
}

self.__config = {
  bare: "http://localhost:8080/",
  prefix: "/~/",
  codec: codec.none
}

export default self.__config;
