import "./codecs.js";
import "./config.js";
import "./rewrites.js";

import BareClient from "./bare-client/BareClient.js";

const bareClient = new BareClient(location.origin + _$config.bare);

async function fetchEvent (event) {
  if (!/^https?:\/\//i.test(event.request.url) || new URL(event.request.url).pathname.startsWith("/osana")) {
    return await fetch(event.request.url);
  }

  let url = _$config.codec.decode(event.request.url.split(_$config.prefix).slice(1).join(_$config.prefix));
  if (!url) return new Response("");
  self.requestURL = new URL(url);

  const response = await bareClient.fetch(requestURL.href, {
    headers: Object.fromEntries(event.request.headers.entries())
  });
  // TODO: rewrite headers
  const headers = Object.fromEntries(response.headers.entries());
  ["cache-control", "content-security-policy", "content-encoding", "content-length", "cross-origin-opener-policy", "cross-origin-opener-policy-report-only", "report-to", "strict-transport-security", "x-content-type-options", "x-frame-options"].forEach((header) => {
    response.headers.delete(header);
  });

  let res;
  if (/text|application/.test(headers["content-type"])) {
    res = await response.text();
  } else {
    res = response.body
  }

  if ((headers["content-type"] || "").startsWith("text/html")) {
    // sadly not supported in a service worker
    // const document = new DOMParser().parseFromString(text, "text/html");
    
    res = `
      <!DOCTYPE html>
      <head>
        <meta charset="utf-8">
        <script src="/osana/codecs.js"></script>
        <script src="/osana/config.js"></script>
        <script src="/osana/rewrites.js"></script>
        <script src="/osana/client.js"></script>
        <script src="/osana/mutation.js"></script>
        <link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjYGBkZAAAAAoAAx9k7/gAAAAASUVORK5CYIIA">
      </head>
      ${res}
    `;
  } else if ((headers["content-type"] || "").startsWith("application/javascript") || event.request.destination === "script") {

    res = _$rewriteJS(res);

  } else if ((headers["content-type"] || "").startsWith("text/css") || event.request.destination === "style") {

    console.log(event.request.referrer || event.srcElement.requestURL.href);
    res = _$rewriteCSS(res, event.request.referrer || event.srcElement.requestURL.href);

  }

  // rewrite redirects
  if (response.status === 301) {
    response.headers.set("location", _$config.prefix + _$config.codec.encode(headers["location"]));
  }

  return new Response(res, {
    status: response.status,
    headers: response.headers
  });
}

export { fetchEvent };
