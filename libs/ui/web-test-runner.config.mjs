import { importMapsPlugin } from '@web/dev-server-import-maps';

export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
  /** Test files to run */
  files: 'dist/out-tsc/libs/ui/**/*.spec.js',

  coverageConfig: {
    reportDir: '../../coverage/libs/ui',
    report: true,
    reporters: ['html', 'text', 'text-summary'],
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
            '@fes/injector': '/dist/out-tsc/libs/injector/src/index.js',
          },
        },
      },
    }),
  ],
});
