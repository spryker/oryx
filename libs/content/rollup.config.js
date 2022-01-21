const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const includePaths = require('rollup-plugin-includepaths');
const typescript = require('rollup-plugin-typescript2');

module.exports = (config) => {
  return {
    input: 'libs/content/banner/index.ts',
    output: {
      file: 'dist/libs/content/banner.bundled.js',
      format: 'esm',
    },
    onwarn(warning) {
      if (warning.code !== 'THIS_IS_UNDEFINED') {
        console.error(`(!) ${warning.message}`);
      }
    },
    plugins: [
      typescript(),
      nodeResolve(),
      terser({
        ecma: 2017,
        module: true,
        warnings: true,
        mangle: {
          properties: {
            regex: /^__/,
          },
        },
      }),
    ],
  };
};
