import "./element";
import FetchProxy from "./fetch";
import * as History from "./history";
import LocationProxy from "./location";
import WindowProxy from "./window";
import XMLHttpRequestProxy from "./xmlhttp";
import RequestProxy from "./request";

declare global {
  interface Window {
    __parent: Window;
    __location: Location;
    __window: Window;
    __self: Window;
    __top: Window;
  }
}

window.fetch = FetchProxy;
window.Request = RequestProxy;
window.history.pushState = History.pushState;
window.history.replaceState = History.replaceState;
window.__parent = WindowProxy.parent;
window.__top = WindowProxy.top;
window.__window = WindowProxy;
window.__location = LocationProxy;
window.__self = WindowProxy;
window.XMLHttpRequest.prototype.open = XMLHttpRequestProxy;
