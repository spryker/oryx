const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');

module.exports = {
  core: { builder: 'webpack5' },
  stories: ['../../../libs/**/*.stories.@(ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
    'storybook-addon-pseudo-states',
    'storybook-addon-rtl',
    './oryx-addon/register.js',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
        babelOptions: {},
        sourceLoaderOptions: null,
        transcludeMarkdown: true,
      },
    },
  ],
  webpackFinal: async (config, { configType }) => {
    // add your own webpack tweaks if needed
    config.resolve.plugins = [
      new TsconfigPathsPlugin({ extensions: config.resolve.extensions }),
    ];

    // A hack needed for webpack to fix resolution of CLDR package
    // See https://github.com/globalizejs/globalize/issues/603
    config.resolve.alias = {
      ...config.resolve.alias,
      cldr$: 'cldrjs',
      cldr: 'cldrjs/dist/cldr',
    };

    return config;
  },
};
