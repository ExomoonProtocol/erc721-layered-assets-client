// webpack.config.js
const path = require("path");
const slsw = require("serverless-webpack");

module.exports = {
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  entry: slsw.lib.entries,
  resolve: {
    mainFields: ["main", "development"],
    extensions: [".ts", ".tsx", ".py", ".js"],
  },
  target: "node",
  externals: ["canvas", "aws-sdk", "aws-lambda", "@types/aws-lambda", "@types/aws-sdk"],
  module: {
    rules: [
      {
        test: /\.node$/,
        loader: "node-loader",
      },
      {
        test: /\.(tsx?)$/,
        loader: "ts-loader",
        exclude: [
          [
            path.resolve(__dirname, "node_modules"),
            path.resolve(__dirname, ".serverless"),
            path.resolve(__dirname, ".webpack"),
          ],
        ],
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
};
