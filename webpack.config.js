const path = require('path');
const pkg = require('./package.json');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: pkg.name,
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
          },
        },
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  target: 'node',
  externals: [nodeExternals()]
};