const path = require("path");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: {
    "osana.config.js": "./src/config.ts",
    "osana.worker.js": "./src/lib/util/worker.ts",
    "osana.client.js": "./src/lib/client/index.ts",
    "osana.bundle.js": "./src/bundle.ts"
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "static"),
    },
    compress: true,
    port: 3000,
    proxy: {
      "/bare/v1": {
        target: "ws://localhost:8080",
        pathRewrite: { "^/bare": "" },
        ws: true
      },
      "/bare": {
        target: "http://localhost:8080",
        pathRewrite: { "^/bare": "" }
      }
    }
  }
};
