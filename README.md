
# Osana // Explore Faster
Osana is an hyper interception proxy.
Deploy Easy, Explore Fast. 
## How it works
 Osana intercepts HTTP requests using service workers that complies with the TompHTTP specifications. 


## WARNING
Osana is an **OPEN BETA** and is about 80% complete. Contributions are highly welcome. 
## Deployment

### Quick deployment
```bash
$ git clone https://github.com/NebulaServices/Osana.git
$ cd Osana
$ npm i
$ npm run build 
$ npm start
```


### How to run on Repl.it

1. Import the repository via the import button. 
2. Install all Node modules with `npm i` or `npm ci` in shell
3. Build the scripts by running `npm run build` in shell
4. Done! 
## Configuration
Configuring Osana is simple. The basic descriptions of each configurable option are provided as a comment in the block below. 
  ### Availale codecs
- none
- planetext 
- base64
- xor (recommended)
- whatthefuck (Not recommended & not passing)

### `src/config.ts`

```ts

self.__osana$config = {
  bare: `${location.origin}/bare/`, // The location of the Bare server
  prefix: "/~osana/", // Proxy url prefix
  codec: self.__osana$bundle.codecs.xor, // Encoding method 
  files: {
    config: "/osana.config.js",
    client: "/osana.client.js",
    bundle: "/osana.bundle.js", // Osana bundle 
    worker: "/osana.worker.js"
  },
  blacklist: [
    /^(www\.)?netflix\.com/,
    /^accounts\.google\.com/,
  ]
}

```

| Configuration |  Explanation | Options
| --- | ----------- | ----------- |
| bare | The location (directory) the bare server exists in |  --
| prefix | The prefix that the proxy will show webpages on. For example: `https://osanaweb.us/~osana/https://google.com` | the default is `~osana`
| codec | The encoding of the URL that will be shown to visitors.  | `none`, `planetext`, `base64`, `xor`
| blacklist | the blacklist disallows any requests from the URLs listed under the blacklist. This is helpful for removing a site from accesibility due to legalities. Typically we don't recommend this.  | regex of any web address or URL 



### Building scripts
The scripts will appear in the /dist directory.
```bash
npm run build
```


## Features

- reCaptcha and hCAPTCHA support
- Fast speeds, highly efficient 
- Blacklist setting
- 6 codecs to increase stealth and better hide activity
- Link blacklist
- Fast setup and run

## Supported sites

- Google
- Brave
- Bing 
- Reddit
## Tech Stack


- Service Workers
- HTML, JS, CSS rewriting
- Parse5
- Mariyah

## License

[GNU AGPL v3](https://choosealicense.com/licenses/mit/)


## Authors

- [@cohenerickson](https://www.github.com/cohenerickson)

