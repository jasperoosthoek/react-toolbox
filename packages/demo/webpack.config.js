const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { NxReactWebpackPlugin } = require('@nx/react/webpack-plugin');
const { join, resolve } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../dist/demo'),
  },
  devServer: {
    port: 4200,
    historyApiFallback: {
      index: '/index.html',
      disableDotRule: true,
      htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
    },
  },
  plugins: [
    new NxAppWebpackPlugin({
      tsConfig: './tsconfig.app.json',
      compiler: 'babel',
      main: './src/main.tsx',
      index: './src/index.html',
      baseHref: '/',
      assets: ['./src/favicon.ico', './src/assets'],
      styles: ['./src/styles.scss'],
      outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none',
      optimization: process.env['NODE_ENV'] === 'production',
    }),
    new NxReactWebpackPlugin({
      // Uncomment this line if you don't want to use SVGR
      // See: https://react-svgr.com/
      // svgr: false
    }),
  ],
  resolve: {
    symlinks: false,
    alias: {
      // Manually point modules to their default location so react-toolbox can be 
      // imported like it is a module installed in node_modules
      'react': resolve(__dirname, '../../node_modules/react'),
      'react-dom': resolve(__dirname, '../../node_modules/react-dom'),
      'redux': resolve(__dirname, '../../node_modules/redux'),
      'react-redux': resolve(__dirname, '../../node_modules/react-redux'),
      'react-dnd': resolve(__dirname, '../../node_modules/react-dnd'),
      'react-dnd-html5-backend': resolve(__dirname, '../../node_modules/react-dnd-html5-backend'),
    }
  }
};
