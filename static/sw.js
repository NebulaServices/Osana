import { fetch } from "./osana/fetch.js";

self.addEventListener("fetch", event => event.respondWith(fetch(event)));
