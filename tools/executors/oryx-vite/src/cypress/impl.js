'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const devkit_1 = require('@nx/devkit');
const cypress = require('cypress');
const path = require('path');
const path_1 = require('path');
const vite_1 = require('vite');
const istanbul = require('vite-plugin-istanbul');
var BUILD_MODE_MAP;
(function (BUILD_MODE_MAP) {
  BUILD_MODE_MAP['development'] = 'development';
  BUILD_MODE_MAP['production'] = 'production';
  BUILD_MODE_MAP['ci'] = 'ci';
  BUILD_MODE_MAP['test'] = 'test';
})(BUILD_MODE_MAP || (BUILD_MODE_MAP = {}));
async function cypressViteExecutor(options, context) {
  const projectDir = context.workspace.projects[context.projectName].root;
  const projectRoot = (0, devkit_1.joinPathFragments)(
    `${context.root}/${projectDir}`
  );
  const cypressConfig = {
    ...options.cypress,
    project: (0, path_1.dirname)(options.cypress?.configFile),
    configFile: (0, path_1.basename)(options.cypress.configFile),
  };
  const isViteDevServer = options.vite?.devServer;
  const viteConfigFile = options.vite?.configFile;
  const viteMode =
    options.vite?.mode && BUILD_MODE_MAP[options.vite?.mode]
      ? options.vite?.mode
      : 'development';
  const vitePort = options.vite?.port || 4200;
  const viteRoot = options.vite?.root || './';
  const serverConfig = {
    configFile: viteConfigFile,
    mode: viteMode,
    root: viteRoot,
    server: {
      port: vitePort,
    },
    preview: {
      port: vitePort,
    },
    plugins: [
      // @ts-ignore
      istanbul({
        cwd: path.resolve(context.root, ...viteRoot.split('/')),
        include: ['**/*.js', '**/*.ts'],
        extension: ['.js', '.ts'],
        exclude: ['**/*.spec.js', '**/*.spec.ts'],
        cypress: true,
        requireEnv: false,
      }),
    ],
  };
  const server = new ViteServer(serverConfig, isViteDevServer);
  await server.createServer();
  server.getServer().printUrls();
  const result = await (options.cypress?.watch
    ? cypress.open(cypressConfig)
    : cypress.run(cypressConfig));
  await server.close();
  return {
    success: !result?.totalFailed && !result?.failures,
  };
}
exports.default = cypressViteExecutor;
class ViteServer {
  constructor(config = {}, isDevServer = false) {
    this.isDevServer = false;
    this.server = undefined;
    this.config = config;
    this.isDevServer = isDevServer;
  }
  async createServer() {
    if (this.isDevServer) {
      this.server = await (0, vite_1.createServer)(this.config);
      await this.server.listen();
    } else {
      await (0, vite_1.build)({
        configFile: this.config.configFile,
        mode: this.config.mode,
        root: this.config.root,
      });
      this.server = await (0, vite_1.preview)(this.config);
    }
  }
  getServer() {
    if (!this.server) {
      throw new Error('Server is not set');
    }
    return this.server;
  }
  async close() {
    if (this.isDevServer) {
      await this.getServer().close();
    } else {
      await this.getServer().httpServer.close();
    }
  }
}
