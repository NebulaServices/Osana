import "./codecs.js";
import "./config.js";
import "./rewrites.js";
import "./url.js";

import BareClient from "./bare-client/BareClient.js";

const bareClient = new BareClient(location.origin + _$config.bare);

async function fetchEvent (event) {
  // fix errors when chrome extensions load resources
  // don't parse scripts if it is an osana script
  if (!/^https?:\/\//i.test(event.request.url) || /^\/osana/.test(new URL(_$config.codec.decode(event.request.url)).pathname)) {
    return await fetch(event.request.url);
  }

  let origin;
  if (event.clientId) {
    const client = await clients.get(event.clientId);
    origin = _$config.codec.decode(new URL(client.url).pathname.replace(new RegExp(`^${_$config.prefix}`), ""));
  }

  let url;
  const requestURL = new URL(event.request.url);
  if (new RegExp(`^${_$config.prefix}`).test(requestURL.pathname)) {
    url = new URL(_$config.codec.decode(requestURL.href.replace(new RegExp(`^.+?${_$config.prefix}`), "")));
  } else {
    url = new URL(_$combine(origin, requestURL.pathname));
  }

  const response = await bareClient.fetch(url.href, {
    headers: Object.fromEntries(event.request.headers.entries())
  });
  
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
    res = `
      <!DOCTYPE html>
      <head>
        <meta charset="utf-8">
        <script src="/osana/codecs.js"></script>
        <script src="/osana/config.js"></script>
        <script src="/osana/url.js"></script>
        <script src="/osana/rewrites.js"></script>
        <script src="/osana/client.js"></script>
        <script src="/osana/mutation.js"></script>
        <link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjYGBkZAAAAAoAAx9k7/gAAAAASUVORK5CYIIA">
        <link rel="icon" href="${url.origin}/favicon.ico">
      </head>
      ${res}
    `;
  } else if ((headers["content-type"] || "").startsWith("application/javascript") || event.request.destination === "script") {

    res = _$rewriteJS(res);

  } else if ((headers["content-type"] || "").startsWith("text/css") || event.request.destination === "style") {

    res = _$rewriteCSS(res, origin);

  }

  // rewrite redirects
  if (response.status === 301) {
    // TODO: fix this
    response.headers.set("location", _$config.prefix + _$config.codec.encode(headers["location"]));
  }

  return new Response(res, {
    status: response.status,
    headers: response.headers
  });
}

export { fetchEvent };
