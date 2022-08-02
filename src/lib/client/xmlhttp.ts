import rewriteURL from "../rewrite/url";

const XMLOpen = window.XMLHttpRequest.prototype.open;
export default function (...args: any) {
  args[1] = rewriteURL(args[1]);
  return XMLOpen.call(this, ...args);
};
