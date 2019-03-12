const path = require('path');

var BUILD_DIR = path.resolve(__dirname, "public/js");
var APP_DIR = path.resolve(__dirname, "src");

var config = {
    entry: {
      wallet: ["babel-polyfill", APP_DIR + '/index.jsx'],
    },
  
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: APP_DIR,
          loader: "babel-loader",
          query:
          {
            presets:['react']
          }
        },
        {
          test:/\.css$/,
          use:['style-loader','css-loader']
        }
      ]
    },
    output: {
      path: BUILD_DIR,
      filename: "main.js"
    }
  };
  
  module.exports = config;