import config from "../config";
import FetchEvent from "./types/FetchEvent";
import BareClient from "@tomphttp/bare-client";

import rewriteCSS from "./rewrite/css";
import rewriteHeaders from "./rewrite/headers"
import rewriteHTML from "./rewrite/html";
import rewriteJS from "./rewrite/js";
import rewriteURL from "./rewrite/url";

const bareClient = new BareClient(config.bare);

export default async function handleRequest (event: FetchEvent): Promise<Response> {
  const url = config.codec.decode(new URL(event.request.url).pathname.replace(config.prefix, "")) + new URL(event.request.url).search;
  if (!/^https?:\/\//.test(url)) {
    return fetch(event.request.url);
  }
  const requestURL = new URL(url);
  const requestHeaders = Object.fromEntries(event.request.headers.entries());
  requestHeaders["host"] = requestURL.hostname;

  if (config.blacklist && config.blacklist.some(regex => regex.test(requestURL.host))) {
    return new BlackListedResponse();
  }

  const bareRequestData: { [key: string]: any } = {
    method: event.request.method,
    headers: requestHeaders
  }
  if (!["GET", "HEAD"].includes(event.request.method)) bareRequestData.body = await event.request.blob();

  const response = await bareClient.fetch(requestURL, bareRequestData);
  let responseStatus = response.rawResponse.status;
  const responseHeaders = rewriteHeaders(response.rawHeaders as any, requestURL);

  let responseData: any = "";
  if (/text\/html/.test(responseHeaders["Content-Type"] as string)) {
    responseData = 
      `<head>` +
        `<script src="${config.files.config}"></script>` +
        `<script src="${config.files.client}"></script>` +
        `<link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjYGBkZAAAAAoAAx9k7/gAAAAASUVORK5CYIIA">` +
        `<link rel="icon" href="${requestURL.origin}/favicon.ico">` +
        `${(responseStatus === 301 && responseHeaders["location"]) ? `<meta http-equiv="refresh" content="0; url=${rewriteURL(responseHeaders["location"] as string)}">` : ""}` +
      `</head>`;
    responseData += rewriteHTML(await response.text(), (requestURL.origin + requestURL.pathname));
  } else if (/text\/css/.test(responseHeaders["Content-Type"] as string) || event.request.destination === "style") {
    responseData = rewriteCSS(await response.text(), (requestURL.origin + requestURL.pathname));
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

class BlackListedResponse extends Response {
  constructor () {
    super("Forbidden", {
      status: 403,
      statusText: "Forbidden",
      headers: {
        "Content-Type": "text/plain"
      }
    });
  }
}
