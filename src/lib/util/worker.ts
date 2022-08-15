import FetchEvent from "../types/FetchEvent";
importScripts(`./osana.bundle.js?1`);
importScripts(`./osana.config.js?1`);

declare global {
  interface Window {
    OsanaServiceWorker: any;
  }
}

self.OsanaServiceWorker = class OsanaServiceWorker {
  config: typeof self.__osana$config;
  bundle: typeof self.__osana$bundle;
  bareClient: any;

  constructor () {
    this.config = self.__osana$config;
    this.bundle = self.__osana$bundle;
    this.bareClient = new this.bundle.BareClient(this.config.bare);
  }

  async fetch (event: FetchEvent): Promise<Response> {
    const url = this.config.codec.decode(new URL(event.request.url).pathname.replace(this.config.prefix, "")) + new URL(event.request.url).search;
    if (!/^https?:\/\//.test(url)) {
      return fetch(event.request.url);
    }
    const requestURL = new URL(url);
    const requestHeaders = this.bundle.rewrite.headers.request(Object.fromEntries(event.request.headers.entries()), requestURL);

    if (this.config.blacklist && this.config.blacklist.some(regex => regex.test(requestURL.host))) {
      return new BlackListedResponse();
    }

    const bareRequestData: { [key: string]: any } = {
      method: event.request.method,
      headers: requestHeaders
    }
    if (!["GET", "HEAD"].includes(event.request.method)) bareRequestData.body = await event.request.blob();
  
    const response = await this.bareClient.fetch(requestURL, bareRequestData);
    let responseStatus = response.rawResponse.status;
    const responseHeaders = this.bundle.rewrite.headers.response(response.rawHeaders as any, requestURL);

    let responseData: any = "";
    if (/text\/html/.test(responseHeaders["Content-Type"] as string)) {
      responseData = 
        `<head>` +
          `<script src="${this.config.files.bundle}?1"></script>` +
          `<script src="${this.config.files.config}?1"></script>` +
          `<script src="${this.config.files.client}?1"></script>` +
          `<link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjYGBkZAAAAAoAAx9k7/gAAAAASUVORK5CYIIA">` +
          `<link rel="icon" href="${requestURL.origin}/favicon.ico">` +
          `${(responseStatus === 301 && responseHeaders["location"]) ? `<meta http-equiv="refresh" content="0; url=${this.bundle.rewrite.url(responseHeaders["location"] as string)}">` : ""}` +
        `</head>`;
      responseData += this.bundle.rewrite.html(await response.text(), (requestURL.origin + requestURL.pathname));
    } else if (/text\/css/.test(responseHeaders["Content-Type"] as string) || event.request.destination === "style") {
      responseData = this.bundle.rewrite.css(await response.text(), (requestURL.origin + requestURL.pathname));
    } else if (/application\/javascript/.test(responseHeaders["Content-Type"] as string) || event.request.destination === "script") {
      responseData = this.bundle.rewrite.js(await response.text());
    } else {
      responseData = await response.arrayBuffer();
    }

    return new Response(responseData, {
      status: response.rawResponse.status,
      statusText: response.rawResponse.statusText,
      headers: responseHeaders as HeadersInit
    });
  }
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