import Server from "bare-server-node";
import http from "http";
import https from "https";
import nodeStatic from "node-static";
import lsIPs from "./lsIPs.js";
import fs from "fs";

const bare = new Server("/bare/", "");

const serve = new nodeStatic.Server("static");
const lsServe = new nodeStatic.Server("ls");

const httpServer = http.createServer();
const httpsServer = https.createServer({});

httpServer.on("request", request);
httpsServer.on("request", request);
httpServer.on("upgrade", upgrade);
httpsServer.on("upgrade", upgrade);

function request (req, res) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  // block LS bots
  if (lsIPs.includes(ip)) return lsServe.serve(req, res);

  // block search engines
  if (/bot|crawl|spider/.test(req.headers["User-Agent"])) return;

  if (bare.route_request(req, res)) return;
  serve.serve(req, res);
}

function upgrade (req, socket, head) {
  if (bare.route_upgrade(req, socket, head)) return;
  socket.end();
};

fs.readdir("/etc/letsencrypt/live", { withFileTypes: true }, (err, files) => {
  if (!err) {
    const dirs = files
      .filter(d => d.isDirectory())
      .map(d => d.name);

    dirs.forEach((dir) => {
      console.log(dir);
      httpsServer.addContext(dir.split("-")[0], {
        key: fs.readFileSync(`/etc/letsencrypt/live/${dir}/privkey.pem`),
        cert: fs.readFileSync(`/etc/letsencrypt/live/${dir}/fullchain.pem`)
      });
    });
  }

  httpsServer.listen(443);
  httpServer.listen(80);
  console.log(`Listening on port 80 and 443`);
});
