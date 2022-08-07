const path = require("path");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: {
    config: "./src/config.ts",
    sw: "./src/sw.ts",
    client: "./src/lib/client/index.ts",
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
    filename: "[name].js",
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
