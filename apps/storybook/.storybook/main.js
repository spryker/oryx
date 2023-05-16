const rootMain = require('../../../.storybook/main');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');

module.exports = {
  ...rootMain,
  core: { ...rootMain.core, builder: 'webpack5' },
  stories: [...rootMain.stories, '../../../libs/**/*.stories.@(ts|tsx|mdx)'],
  addons: [
    ...rootMain.addons,
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
    // apply any global webpack configs that might have been specified in .storybook/main.js
    if (rootMain.webpackFinal) {
      config = await rootMain.webpackFinal(config, { configType });
    }

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
