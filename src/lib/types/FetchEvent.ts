export default interface FetchEvent extends Event {
	request: any;
	respondWith(response: Promise<Response>|Response): Promise<Response>;
}
