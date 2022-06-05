import "./codecs.js";
import "./config.js";

import BareClient from './bare-client/BareClient.js';

const bareClient = new BareClient(location.origin + _$config.bare);

async function fetchEvent (event) {
  if (!/^https?:\/\//i.test(event.request.url) || new URL(event.request.url).pathname.startsWith("/osana")) {
    return await fetch(event.request.url);
  }

  console.log(event.request.url);

  let url = _$config.codec.decode(event.request.url.split(_$config.prefix).slice(1).join(_$config.prefix));
  self.requestURL = new URL(url);

  const response = await bareClient.fetch(requestURL.href, {
    headers: Object.fromEntries(event.request.headers.entries())
  });
  const headers = Object.fromEntries(response.headers.entries());
  const text = await response.text();

  let responseText = text;

  if (headers["content-type"].startsWith("text/html")) {
    // sadly not supported in a service worker
    // const document = new DOMParser().parseFromString(text, "text/html");
    
    responseText = `
      <!DOCTYPE html>
      <head>
        <meta charset="utf-8">
        <script src="/osana/codecs.js"></script>
        <script src="/osana/config.js"></script>
        <script src="/osana/client.js"></script>
        <script src="/osana/mutation.js"></script>
      </head>
      ${text}
    `
  } else if (headers["content-type"].startsWith("application/javascript")) {
    // basic js parsing
    responseText = text.replace(/location|window/g, "_$&");
  }
  return new Response(responseText, {
    status: response.status,
    headers: response.headers
  });
}

export { fetchEvent };
