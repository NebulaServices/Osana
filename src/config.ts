declare global {
  interface Window {
    __osana$config: {
      bare: string;
      prefix: string;
      codec: {
        encode: (str: string) => string;
        decode: (str: string) => string;
      },
      files: {
        config: string;
        client: string;
        bundle: string;
//        sw: string;
      },
      blacklist?: RegExp[];
    }
  }
}

self.__osana$config = {
  bare: `${location.origin}/bare/`,
  prefix: "/~osana/",
  codec: self.__osana$bundle.codecs.none,
  files: {
    config: "/osana.config.js",
    client: "/osana.client.js",
    bundle: "/osana.bundle.js",
//    sw: "/sw.js"
  },
  blacklist: [
    /^(www\.)?netflix\.com/,
    /^accounts\.google\.com/,
  ]
}

export default self.__osana$config;
