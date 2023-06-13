import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import 'dotenv/config';
import injectProcessEnv from 'rollup-plugin-inject-process-env';

const envPrefix = 'ORYX_';

const production = !process.env.ROLLUP_WATCH;

const env = Object.fromEntries(
  Object.entries(process.env).filter(([name]) => name.startsWith(envPrefix))
);

export default {
  input: 'sw/main.ts',
  output: {
    dir: 'dev-dist/sw',
    format: 'es',
    sourcemap: !production,
  },
  preserveEntrySignatures: 'strict',
  plugins: [
    commonjs(),
    nodeResolve({
      jsnext: true,
      preferBuiltins: true,
      browser: true,
    }),
    typescript({ tsconfig: 'tsconfig.sw.json' }),
    json(),
    injectProcessEnv(
      {
        ...env,
        NODE_ENV: production ? 'production' : 'development',
        PROD: production,
        DEV: !production,
      },
      { exclude: 'node_modules/**' }
    ),
  ],
};
