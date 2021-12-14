export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
  /** Test files to run */
  files: 'dist/out-tsc/libs/components/src/lib/**/*.spec.js',

  coverageConfig: {
    reportDir: '../../coverage/libs/components',
  },
  /** Resolve bare module imports */
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },
});
