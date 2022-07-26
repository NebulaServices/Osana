import handleRequest from "./lib/handleRequest";

interface FetchEvent extends Event {
	request: Request;
	respondWith(response: Promise<Response>|Response): Promise<Response>;
}

self.addEventListener("fetch", (event: FetchEvent): void => {
  event.respondWith(handleRequest(event));
});
