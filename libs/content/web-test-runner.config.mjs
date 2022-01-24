import { importMapsPlugin } from '@web/dev-server-import-maps';

export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
  /** Test files to run */
  files: 'dist/out-tsc/libs/content/**/*.spec.js',

  coverageConfig: {
    reportDir: '../../coverage/libs/content',
  },
  /** Resolve bare module imports */
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },

  plugins: [
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            '@spryker-oryx/injector':
              '/dist/out-tsc/libs/injector/src/index.js',
          },
        },
      },
    }),
  ],
});
