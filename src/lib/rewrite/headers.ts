import Headers from "../types/Headers";
import rewriteURL from "./url";

export function request (headers: Headers, requestURL: URL): Headers {
  headers["host"] = requestURL.host;
  return headers;
}

export function response (headers: Headers, requestURL: URL): Headers {
  ["Cache-Control", "Content-Security-Policy", "Content-Security-Policy-Report-Only", /* "Content-Encoding", "Content-Length", */ "Cross-Origin-Opener-Policy", "Cross-Origin-Opener-Policy-Report-Only", "Report-To", "Strict-Transport-Security", "X-Content-Type-Options", "X-Frame-Options", "Access-Control-Allow-Origin"].forEach((header: string): void => {
    delete headers[header];
    delete headers[header.toLowerCase()];
  });
  headers["Location"] = rewriteURL(headers["Location"] || headers["location"])
  return headers;
}
