<p align="center">
  <img src="static/icon.png" style="width: 200px;">
</p>
<h1 align="center">Osana</h1>
<p align="center">An interception based web proxy inspired by other interception proxies.</p>

<p align="center">Osana intercepts HTTP requests using service workers that comply with the <a href="https://github.com/tomphttp/specifications">TompHTTP specifications</a>.</p>

<h1 align="center">Cloning and installing dependencies</h1>

```bash
$ git clone https://github.com/NebulaServices/Osana-Node.git
$ cd Osana-Node
$ npm ci
```

<h1 align="center">Configuration</h1>
  
`src/config.ts`

```ts
import * as codec from "./lib/util/codecs";

declare global {
  interface Window {
    __config: any;
  }
}

self.__config = {
  bare: "http://localhost:8080/",
  prefix: "/~/",
  codec: codec.none
}

export default self.__config;
```

<h1 align="center">Running</h1>


<h2>Production</h2>

```bash
$ npm run build
$ npm run start
```

<h2>Development</h2>

```bash
$ npm run dev
```
