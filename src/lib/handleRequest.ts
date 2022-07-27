import config from "../config";
import FetchEvent from "./types/FetchEvent";
import BareClient from "@tomphttp/bare-client";

import rewriteCSS from "./rewrite/css";
import rewriteHeaders from "./rewrite/headers"
import rewriteHTML from "./rewrite/html";
import rewriteJS from "./rewrite/js";
import rewriteURL from "./rewrite/url";

declare global {
  interface Window {
    __config: any;
  }
}

const bareClient = new BareClient(config.bare);

export default async function handleRequest (event: FetchEvent): Promise<Response> {
  const url = config.codec.decode(new URL(event.request.url));
  if (!/^https?:\/\//.test(config.codec.decode(new URL(event.request.url).pathname.replace(config.prefix, "")))) {
    return fetch(event.request.url);
  }
  const requestURL = new URL((new URL(url).pathname + new URL(url).search).replace(config.prefix, ""));
  const requestHeaders = Object.fromEntries(event.request.headers.entries());

  const response = await bareClient.fetch(requestURL, {
    headers: requestHeaders
  });
  let responseStatus = response.rawResponse.status;
  const responseHeaders = rewriteHeaders(response.rawHeaders as any, requestURL);

  let responseData: any = "";
  if (/text\/html/.test(responseHeaders["Content-Type"] as string)) {
    responseData = `
      <head>
        <script src="/config.js"></script>
        <script src="/client.js"></script>
        <link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjYGBkZAAAAAoAAx9k7/gAAAAASUVORK5CYIIA">
        <link rel="icon" href="${requestURL.origin}/favicon.ico">
        ${(responseStatus === 301 && responseHeaders["location"]) ? `<meta http-equiv="refresh" content="0; url=${rewriteURL(responseHeaders["location"] as string)}">` : ""}
      </head>
    `;
    responseData += rewriteHTML(await response.text(), (requestURL.origin + requestURL.pathname));
  } else if (/text\/css/.test(responseHeaders["Content-Type"] as string) || event.request.destination === "style") {
    responseData = rewriteCSS(await response.text());
  } else if (/application\/javascript/.test(responseHeaders["Content-Type"] as string) || event.request.destination === "script") {
    responseData = rewriteJS(await response.text());
  } else {
    responseData = await response.arrayBuffer();
  }

  return new Response(responseData, {
    status: response.rawResponse.status,
    statusText: response.rawResponse.statusText,
    headers: responseHeaders as HeadersInit
  });
}
