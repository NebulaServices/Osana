self._$codecs = {
  none: {
    encode: (url) => url,
    decode: (url) => url
  },
  plain: {
    encode: (url) => encodeURIComponent(url),
    decode: (url) => decodeURIComponent(url)
  },
  xor: {
    encode: (url) => encodeURIComponent(url.toString().split("").map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join("")),
    decode: (url) => decodeURIComponent(url.split("?")[0]).split("").map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char).join("") + (url.split("?").slice(1).length ? "?" + url.split("?").slice(1).join("?") : "")
  },
  base64: {
    encode: (url) => btoa(url),
    decode: (url) => atob(url)
  }
}
