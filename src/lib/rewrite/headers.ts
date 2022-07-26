import Headers from "../types/Headers";

export default function rewriteHeaders (headers: Headers, requestURL: URL): Headers {
  ["cache-control", "content-security-policy", "content-encoding", "content-length", "cross-origin-opener-policy", "cross-origin-opener-policy-report-only", "report-to", "strict-transport-security", "x-content-type-options", "x-frame-options"].forEach((header: string): void => {
    headers[header] = "";
  });
  headers["host"] = requestURL.hostname;
  return headers;
}
