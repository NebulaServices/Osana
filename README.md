<p align="center">
  <img src="static/icon.png" style="width: 200px;">
</p>
<h1 align="center">Osana</h1>
<p align="center">An interception based web proxy inspired by other interception proxies.</p>

<p align="center">Osana intercepts HTTP requests using service workers that comply with the <a href="https://github.com/tomphttp/specifications">TompHTTP specifications</a>.</p>

<h1 align="center">Installation and Setup</h1>

```bash
$ git clone https://github.com/NebulaServices/Osana-Node.git
$ git submodule update --init --recursive
$ cd Osana
$ npm install
$ npm start
```

<h1 align="center">Configuration</h1>
  
`config.js`

```js
self._$config = {
  bare: "/bare/",     // Bare server URL
  prefix: "/~/",      // Proxy URL prefix
  codec: _$codecs.xor // URL Encoding
}
```
