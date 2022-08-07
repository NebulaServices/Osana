export const none = {
  encode: (url: string = ""): string => url,
  decode: (url: string = ""): string => url
}

export const plain = {
  encode: (url: string = ""): string => encodeURIComponent(url),
  decode: (url: string = ""): string => decodeURIComponent(url)
}

export const xor = {
  encode: (url: string = ""): string => {
    return encodeURIComponent(url.toString().split("").map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char).join(""));
  },
  decode: (url: string = ""): string => {
    let [ input, ...search ] = url.split("?");
    return decodeURIComponent(input).split("").map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char).join("") + (search.length ? "?" + search.join("?") : "");
  }
}

export const base64 = {
  encode: (url: string): string => {
    const TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    url = String(url);
    if (/[^\0-\xFF]/.test(url)) new DOMException("The string to be encoded contains characters outside of the Latin1 range.");
    let padding = url.length % 3,output = "",position = -1,a,b,c,buffer,length = url.length - padding;
    while (++position < length) {a = url.charCodeAt(position) << 16;b = url.charCodeAt(++position) << 8;c = url.charCodeAt(++position);buffer = a + b + c;output += (TABLE.charAt(buffer >> 18 & 0x3F) + TABLE.charAt(buffer >> 12 & 0x3F) + TABLE.charAt(buffer >> 6 & 0x3F) + TABLE.charAt(buffer & 0x3F))}
    if (padding == 2) {a = url.charCodeAt(position) << 8;b = url.charCodeAt(++position);buffer = a + b;output += (TABLE.charAt(buffer >> 10) + TABLE.charAt((buffer >> 4) & 0x3F) + TABLE.charAt((buffer << 2) & 0x3F) + "=");} else if (padding == 1) {buffer = url.charCodeAt(position);output += (TABLE.charAt(buffer >> 2) + TABLE.charAt((buffer << 4) & 0x3F) + "==")}
    return output;
  },
  decode: (url: string): string => {
    const TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    url = String(url).replace(/[\t\n\f\r ]/g, "");
    var length = url.length;
    if (length % 4 == 0) {url = url.replace(/==?$/, "");length = url.length};
    if (length % 4 == 1 || /[^+a-zA-Z0-9/]/.test(url)) throw new DOMException("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    let bitCounter = 0,bitStorage,buffer,output = "",position = -1;
    while (++position < length) {buffer = TABLE.indexOf(url.charAt(position));bitStorage = bitCounter % 4 ? (bitStorage as number) * 64 + buffer : buffer;if (bitCounter++ % 4) output += String.fromCharCode(0xFF & bitStorage >> (-2 * bitCounter & 6))}
    return output;
  }
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
