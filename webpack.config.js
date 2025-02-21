const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');
const path = require('path');
const fs = require('fs');
// Nx plugins for webpack.
module.exports = composePlugins(
  withNx(),
  withReact(),
);
