const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');
// Nx plugins for webpack.
module.exports = composePlugins(
  withNx(),
  withReact()
);
