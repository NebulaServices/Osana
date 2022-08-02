<p align="center">
  <img src="static/icon.png" style="width: 200px;">
</p>
<h1 align="center">Osana</h1>
<p align="center">An interception based web proxy inspired by other interception proxies.</p>

<p align="center">Osana intercepts HTTP requests using service workers that comply with the <a href="https://github.com/tomphttp/specifications">TompHTTP specifications</a>.</p>

<h1 align="center">Cloning and installing dependencies</h1>

```bash
$ git clone https://github.com/NebulaServices/Osana.git
$ cd Osana
$ npm ci
```

<h1 align="center">Configuration</h1>
  
`src/config.ts`

```ts
import * as codecs from "./lib/util/codecs";

declare global {
  interface Window {
    __osana$config: any;
  }
}

self.__osana$config = {
  bare: `${location.origin}/bare/`,
  prefix: "/~/",
  codec: codecs.none,
  files: {
    config: "/config.js",
    client: "/client.js",
    sw: "/sw.js"
  }
}

export default self.__osana$config;
```

<h1 align="center">Building Scripts</h1>

The scripts will appear in the /dist directory.

```bash
npm run build
```

<h1 align="center">Demo</h1>

```bash
npm run start
```
