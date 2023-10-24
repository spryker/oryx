const { mergeConfig } = require('vite');

module.exports = {
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
    '@storybook/addon-mdx-gfm',
  ],

  async viteFinal(config) {
    // Merge custom configuration into the default config
    return mergeConfig(config, {
      // Add dependencies to pre-optimization
      optimizeDeps: {
        include: ['storybook-dark-mode'],
      },
    });
  },

  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },

  docs: {
    autodocs: true,
  },

  features: {
    storyStoreV7: false,
  },
};
