import FetchEvent from "./lib/types/FetchEvent";
import handleRequest from "./lib/handleRequest";

self.addEventListener("fetch", (event: FetchEvent): void => {
  event.respondWith(handleRequest(event));
});
