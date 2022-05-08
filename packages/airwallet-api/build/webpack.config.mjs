import path from "path";
import webpack from "webpack";

const webpackConfig = {
  mode: "production",
  entry: "./lib/airwallet-api.js",
  output: {
    path: path.resolve("dist"),
    filename: "index.js",
    libraryTarget: "commonjs2",
  },
  experiments: {
    outputModule: true,
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: "babel-loader",
      },
    ],
  },
  resolve: {
    alias: {
      process: "process/browser",
    },
  },
  externals: {},
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
  ],
};

export default webpackConfig;
