var path = require('path');

var HtmlWebpackPlugin = require('html-webpack-plugin')
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/client/src/index.html',
  filename: 'index.html',
  inject: 'body'
});

var ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
//    devtool:"eval-source-map",
    devServer: {
//        contentBase: './client/public',
        progress: true,
        colors: true 
    },
    entry: [
            path.resolve(__dirname, 'client/src/main.js')
        ],
    output: {
        path: path.resolve(__dirname, 'client/public'),
        filename: 'bundle.js',
        publicPath : '/'
    },
    module: {
        loaders: [
          //{test: /\.coffee$/, include: __dirname + '/app', loader: "coffee-loader"},
          {
              test: /\.jsx?$/, 
              include: path.join(__dirname, 'client/src'), 
              loader: ["babel-loader"], 
      
              query: {
                  presets: ['es2015', 'react']
                },
              plugins:['transform-class-properties']
          },
          {
              test: /\.css$/,
              include: path.join(__dirname, 'client/src'),
              //loader: "style!css"
              loader: ExtractTextPlugin.extract("style-loader","css-loader")
          }
        ]
      },
    plugins: [
        HTMLWebpackPluginConfig,
        new ExtractTextPlugin("styles.css")
    ],
    resolve: {
        // you can now require('file') instead of require('file.coffee')
        extensions: ['', '.js', '.json', '.coffee'] 
    }
};