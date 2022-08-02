import "./element";
import "./storage";
import FetchProxy from "./fetch";
import * as History from "./history";
import LocationProxy from "./location";
import WindowProxy from "./window";
import XMLHttpRequestProxy from "./xmlhttp";
import RequestProxy from "./request";
import BeaconProxy from "./beacon";

declare global {
  interface Window {
    __parent: Window;
    __location: Location;
    __window: Window;
    __self: Window;
    __top: Window;
    __localStorage: any;
    __sessionStorage: any;
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
navigator.sendBeacon = BeaconProxy;
