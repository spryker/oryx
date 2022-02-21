export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
  /** Test files to run */
  files: 'dist/out-tsc/libs/lit-rxjs/**/*.spec.js',

  coverageConfig: {
    reportDir: '../../coverage/libs/lit-rxjs',
  },
  /** Resolve bare module imports */
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },

  plugins: [],
});
