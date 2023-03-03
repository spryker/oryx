import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import 'dotenv/config';
import { resolve } from 'path';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import * as url from 'url';

const envPrefix = 'ORYX_';

const production = !process.env.ROLLUP_WATCH;

const env = Object.fromEntries(
  Object.entries(process.env).filter(([name]) => name.startsWith(envPrefix))
);

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default {
  input: 'sw/main.ts',
  output: {
    dir: 'dev-dist/sw',
    format: 'es',
    sourcemap: !production,
  },
  preserveEntrySignatures: 'strict',
  plugins: [
    alias({
      entries: [
        {
          find: /^lit(-[^/]+)?(\/.+)?/,
          replacement: resolve(__dirname, './lit-stub$2'),
        },
        {
          find: /^@spryker-oryx\/utilities(\/.+)?/,
          replacement: resolve(
            __dirname,
            '../../libs/base/utilities/no-lit$1'
          ),
        },
      ],
    }),
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
