import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from '../../../libs/application/server/src/server.js';
import { viteConfig } from '../vite.config.common.js';

const config = {
  isProd: process.env.NODE_ENV === 'production',
  __dirname: dirname(fileURLToPath(import.meta.url)),
  prod: {
    root: join(viteConfig.monorepoRoot, viteConfig.build.outDirRoot),
    entry: join(
      viteConfig.build.ssr,
      viteConfig.ssr.entry.replace('.ts', '.js')
    ),
    index: viteConfig.build.index,
  },
  dev: {
    root: viteConfig.root,
    entry: join(viteConfig.ssr.root, viteConfig.ssr.entry),
    index: viteConfig.index,
  },
  component: '<root-app></root-app>',
  namespace: viteConfig.ssr.namespace,
};

createServer(config);
