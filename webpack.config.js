var webpack = require("webpack");
module.exports = {
  "context": __dirname + "/client",
  "cache": true,
  "debug": true,
  "output": {
    "filename": "[name].js",
    "path": __dirname + "/public/js"
  },
  "entry": {
    "theme": ["./theme.js"],
    "admin": ["./admin.js"]
  },
  "module": {
    "loaders": [
      {
        "test": /\.json$/,
        "loader": "json-loader"
      },
      {
        "test": /\.js?$/,
        "exclude": /(node_modules|bower_components|\/vendor)/,
        "loader": 'babel', // 'babel-loader' is also a legal name to reference
        "query": {
          "presets": ['es2015']
        }
      },
      {
        "test": /\.css$/,
        "loader": "style-loader!css-loader"
      },
      { "test": /\.jade$/,
        loader: "pug"
      }
    ]
  },
  externals: {
    jquery: 'jQuery',
    underscore: '_',
    backbone: "Backbone",
  },
  "plugins": [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ro|en/),
    new webpack.ProvidePlugin({
      $: 'jquery',
      _ : 'underscore',
      backbone : 'backbone'
    })
    // new webpack.IgnorePlugin(/^(jquery)$/)
  ]
};