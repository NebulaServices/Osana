import "./element";
import "./style";
import "./storage";
import "./navigator";
import MessageProxy from "./message";
import FetchProxy from "./fetch";
import * as History from "./history";
import LocationProxy from "./location";
import WindowProxy from "./window";
import XMLHttpRequestProxy from "./xmlhttp";
import RequestProxy from "./request";
import BeaconProxy from "./beacon";
import WebSocketProxy from "./websocket";
import EvalProxy from "./eval";
import WorkerProxy from "./worker";
import OpenProxy from "./open";

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
window.WebSocket = WebSocketProxy;
window.eval = EvalProxy;
window.Worker = WorkerProxy;
window.open = OpenProxy;
window.addEventListener = new MessageProxy(window) as any;
window.Worker.prototype.addEventListener = new MessageProxy(window.Worker.prototype) as any;
