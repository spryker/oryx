const webpack = require('webpack');

module.exports = ({ config }) => {
  config.plugins.push(
    new webpack.DefinePlugin({
      __ORYX_FEATURE_VERSION__: JSON.stringify('latest')
    })
  );

  return config;
};
