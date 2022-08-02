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

export const whatTheFuck = {
  decode: (string: string): string => {
    const charShiftLength = parseInt(string.substring(0, 2));
    const charShiftData = parseInt(string.substring(2, charShiftLength + 2));
    const str = decodeURIComponent(string.substring(charShiftLength + 2, string.length));
    const sections = str.match(new RegExp(`.{1,${charShiftLength}}`, "g"));
    let out = "";
    for (let i in sections) for (let j in sections[i].split("")) out += String.fromCharCode(sections[i][j].charCodeAt(0) - parseInt(charShiftData.toString()[j]));
    return decodeURIComponent(out);
  },
  encode: (string: string): string => {
    const charShiftLength = Math.ceil(Math.random() * 10);
    const charShiftData = (n => { let out = ""; for (let i = 0; i < n; i++)out += Math.ceil(Math.random() * 9); return parseInt(out) })(charShiftLength);
    const str = encodeURIComponent(string);
    const sections = str.match(new RegExp(`.{1,${charShiftLength}}`, "g"));
    let out = "";
    for (let i in sections) for (let j in sections[i].split("")) out += String.fromCharCode(sections[i][j].charCodeAt(0) + parseInt(charShiftData.toString()[j]));
    return encodeURIComponent(`${charShiftLength < 10 ? `0${charShiftLength}` : charShiftLength}${charShiftData}${out}`);
  }
}
