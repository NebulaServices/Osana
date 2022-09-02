const rewriteURL = self.__osana$bundle.rewrite.url.rewriteURL;

const XMLOpen = window.XMLHttpRequest.prototype.open;
export default function (...args: any) {
  if (args[1]) args[1] = rewriteURL(args[1]);
  return XMLOpen.call(this, ...args);
};
