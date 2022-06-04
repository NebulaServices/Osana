# Osana

An interception based web proxy inspired by Aero.

Osana intercepts HTTP requests using service workers that comply with the [TompHTTP specifications](https://github.com/tomphttp/specifications).

## Features
 - URL Encoding

# Installation and Setup
```bash
$ git clone https://github.com/NebulaServices/Osana
$ cd Osana
$ npm install
$ npm start
```

# Configuration
`config.js`
```js
self._$config = {
  bare: "/bare/",     // Bare server URL
  prefix: "/~/",      // Proxy URL prefix
  codec: _$codecs.xor // URL Encoding
}
```
