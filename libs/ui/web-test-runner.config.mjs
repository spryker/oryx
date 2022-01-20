export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
  /** Test files to run */
  files: 'dist/out-tsc/libs/ui/**/*.spec.js',

  coverageConfig: {
    reportDir: '../../coverage/libs/ui',
  },
  /** Resolve bare module imports */
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },
});
