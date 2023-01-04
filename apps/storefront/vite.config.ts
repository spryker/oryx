import { join } from 'path';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { adjustEnv } from '../../tools/utils/adjustUrlVariable';
import { viteConfig } from './vite.config.common.js';

export default defineConfig((config) => {
  adjustEnv(config);

  return {
    root: viteConfig.index,
    envDir: viteConfig.root,
    envPrefix: viteConfig.envPrefix,
    build: {
      outDir: join(
        viteConfig.monorepoRoot,
        viteConfig.build.outDirRoot,
        viteConfig.build.index
      ),
      emptyOutDir: true,
    },
    publicDir: '../../../libs/template/presets/public',
    plugins: [...viteConfig.plugins(), splitVendorChunkPlugin()],
  };
});
