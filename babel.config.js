module.exports = {
  presets: [
    "@babel/preset-typescript",
    ['@babel/preset-env', {targets: {node: 'current'}}],
    ['@babel/preset-react', {runtime: 'automatic'}]
  ],
};