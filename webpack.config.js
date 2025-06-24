const path = require('path');
const pkg = require('./package.json');

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
    fallback: {
      fs: false,
      os: false,
      path: false,
      http: false,
      https: false,
      stream: false,
      crypto: false,
      util: false,
      zlib: false,
      tty: false,
      url: false,
      assert: false,
    },
  },
  target: 'web',
  externals: {
    'react': 'react',
    'react-redux': 'react-redux',
    'redux': 'redux',
    'redux-thunk': 'redux-thunk',
    'react-dom': 'react-dom',
    'react-dnd': 'react-dnd',
  },
};