import * as codecs from "./lib/util/codecs";

declare global {
  interface Window {
    __osana$config: {
      bare: string,
      prefix: string,
      codec: {
        encode: (str: string) => string,
        decode: (str: string) => string
      },
      files: {
        config: string,
        client: string,
        sw: string
      }
    }
  }
}

self.__osana$config = {
  bare: `https://tutorialread.beauty/bare/`,
  prefix: "/~osana/",
  codec: codecs.none,
  files: {
    config: "/config.js",
    client: "/client.js",
    sw: "/sw.js"
  }
}

export default self.__osana$config;
