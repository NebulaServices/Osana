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
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "static"),
    },
    compress: false,
    port: 3000,
  }
};
