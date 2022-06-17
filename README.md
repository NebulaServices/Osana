<center>
<img src="static/icon.png" style="width: 200px;">
<h1>Osana</h1>
An interception based web proxy inspired by other interception proxies.

Osana intercepts HTTP requests using service workers that comply with the [TompHTTP specifications](https://github.com/tomphttp/specifications).

<h1>Installation and Setup</h1>
</center>

```bash
$ git clone https://github.com/NebulaServices/Osana-Node.git
$ git submodule update --init --recursive
$ cd Osana
$ npm install
$ npm start
```

<center>
<h1>Configuration</h1>

`config.js`
</center>

```js
self._$config = {
  bare: "/bare/",     // Bare server URL
  prefix: "/~/",      // Proxy URL prefix
  codec: _$codecs.xor // URL Encoding
}
```
