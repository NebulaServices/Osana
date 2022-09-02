import rewriteCSS from "./lib/rewrite/css";
import * as rewriteHeaders from "./lib/rewrite/headers";
import rewriteHTML, { rewriteSrcset } from "./lib/rewrite/html";
import rewriteJS from "./lib/rewrite/js";
import rewriteURL, { unwriteURL } from "./lib/rewrite/url";
import BareClient from "@tomphttp/bare-client";
import { encodeProtocol } from "@tomphttp/bare-server-node/dist/encodeProtocol";
import * as codecs from "./lib/util/codecs";
import { v4 } from "uuid";


declare global {
  interface Window {
    __osana$bundle: {
      codecs: typeof codecs;
      rewrite?: {
        js: typeof rewriteJS;
        css: typeof rewriteCSS;
        html: typeof rewriteHTML;
        srcset: typeof rewriteSrcset;
        headers: typeof rewriteHeaders;
        url: {
          rewriteURL: typeof rewriteURL;
          unwriteURL: typeof unwriteURL;
        };
        protocol: typeof encodeProtocol;
      };
      BareClient: typeof BareClient;
      uuid: typeof v4;
    };
  }
}

self.__osana$bundle = {
  rewrite: {
    css: rewriteCSS,
    html: rewriteHTML,
    srcset: rewriteSrcset,
    js: rewriteJS,
    url: {
      rewriteURL,
      unwriteURL
    },
    headers: rewriteHeaders,
    protocol: encodeProtocol
  },
  codecs: codecs,
  BareClient,
  uuid: v4
}
