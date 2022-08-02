import * as codecs from "./lib/util/codecs";

declare global {
  interface Window {
    __osana$config: any;
  }
}

self.__osana$config = {
  bare: `https://tutorialread.beauty/bare/`,
  prefix: "/~osana/",
  codec: codecs.none,
  files: {
    config: "/config.js",
    client: "/client.js"
  }
}

export default self.__osana$config;
