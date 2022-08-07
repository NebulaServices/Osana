import Headers from "../types/Headers";
import rewriteURL from "./url";

export function request (headers: Headers, requestURL: URL): Headers {
  headers["host"] = requestURL.hostname;
  return headers;
}

export default function response (headers: Headers, requestURL: URL): Headers {
  ["cache-control", "Content-Security-Policy", "Content-Security-Policy-Report-Only", "content-encoding", "content-length", "cross-origin-opener-policy", "cross-origin-opener-policy-report-only", "report-to", "strict-transport-security", "x-content-type-options", "x-frame-options"].forEach((header: string): void => {
    delete headers[header];
    delete headers[header.toLowerCase()];
  });
  headers["Location"] = rewriteURL(headers["Location"] || headers["location"])
  return headers;
}
