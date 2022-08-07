import express from "express";
import http from "node:http";
import createBareServer from "@tomphttp/bare-server-node";

const app = express();
const server = http.createServer(app);
const bareServer = createBareServer("/bare/", {
  logErrors: false,
  localAddress: undefined,
  maintainer: {
    email: "tomphttp@sys32.dev",
    website: "https://github.com/tomphttp/",
  }
});

app.use(express.static("static"));
app.use(express.static("dist"));

app.use((req, res, next) => {
  if (bareServer.shouldRoute(req)) bareServer.routeRequest(req, res);
  else next();
});

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) bareServer.routeUpgrade(req, socket, head);
  else socket.end();
});

server.listen(process.env.PORT || 3000);
console.log(`Server running on port ${process.env.PORT || 3000}`);
