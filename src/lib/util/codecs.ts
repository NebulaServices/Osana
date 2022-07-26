import { btoa, atob } from "./base64";

export const none = {
  encode: (url: string): string => url,
  decode: (url: string): string => url
}

export const plain = {
  encode: (url: string): string => encodeURIComponent(url),
  decode: (url: string): string => decodeURIComponent(url)
}

export const base64 = {
  encode: (url: string): string => btoa(url),
  decode: (url: string): string => atob(url)
}
