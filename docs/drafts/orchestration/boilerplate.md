# Storefront Boilerplate

Spryker suggests [Vite](https://vitejs.dev/) to build frontend. As is a build tool that aims to provide a faster and leaner development experience for modern web projects. Also main benefit that vite supports `ts` under the hood.

## Requirements

- [Node.js](https://nodejs.org/en/download/) - minimum version is v18.
- [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) - minimum version is v8.

## Minimal CSR boilerplate structure

<details>
  <summary>src/app.ts - orchestrator builder (see App Orchestrator)</summary>

  ```ts
  import { appBuilder } from '@spryker-oryx/core';
  import { b2cFeatures } from '@spryker-oryx/presets';
  import { storefrontTheme } from '@spryker-oryx/themes';

  export const app = appBuilder()
    .withEnvironment(import.meta.env)
    .withFeature(b2cFeatures)
    .withTheme(storefrontTheme)
    .create();
  ```
</details>

<details>
  <summary>src/index.html - main entry point</summary>

  ```html
  <!DOCTYPE html>
  <html lang="en">
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Storefront Boilerplate</title>
    <body style="margin: 0">
      <root-app></root-app>
    </body>
    <script type="module" src="./app.ts"></script>
  </html>
  ```
</details>

<details>
  <summary>.env</summary>

  FES_CONTENT_BACKEND_URL=URL-PATH
  SCOS_BASE_URL=URL-PATH
  STORE=DE

</details>

<details>
  <summary>vite.config.ts</summary>

  ```ts
  import { defineConfig } from 'vite';

  export default defineConfig({
    root: './src',
    envDir: '../', // start point from `root`
    envPrefix: ['FES', 'SCOS', 'STORE'], // custom env prefixes
    build: {
      outDir: '../dist/client', // output directory
      emptyOutDir: true,
    },
    server: {
      port: 3000,
    },
  });
  ```
</details>

<details>
  <summary>package.json</summary>

  ```json
  {
    "name": "storefront-boilerplate",
    "type": "module",
    "scripts": {
      "dev": "vite -c vite.config.ts",
      "build": "vite build"
    },
    "dependencies": {
      "@spryker-oryx/presets": "version"
    },
    "devDependencies": {
      "vite": "^4.0.0"
    }
  }
  ```
</details>

</br>


### Quickstart

```
npm run dev - start dev server
npm run build - build for production
```

## Minimal SSR boilerplate
In order to add ssr build you have to add additional pieces of code/files.

<details>
  <summary>server.js - server runner</summary>

  ```js
  import { dirname } from 'path';
  import { fileURLToPath } from 'url';
  import { createServer } from '@spryker-oryx/application/server';

  const config = {
    isProd: process.env.NODE_ENV === 'production',
    __dirname: dirname(fileURLToPath(import.meta.url)),
    prod: {
      root: '../dist', // root folder of artifacts 
      entry: `./server/render.js`, // ssr entry point for dev mode
      index: `./client`, // folder with csr entry point for dev mode
    },
    dev: {
      root: '../', // root folder of boilerplate 
      entry: './server/render.ts', // ssr entry point for dev mode
      index: './src', // folder with csr entry point for dev mode
    },
    component: '<root-app></root-app>',
    namespace: 'storefront', // should be the same as vite.config.server.ts -> build.lib.name
  };

  createServer(config).run();
  ```
</details>

<details>
  <summary>render.ts - main entry point for ssr</summary>

  ```ts
  import { renderApp, RenderAppConfig } from '@spryker-oryx/application';
  import { html } from 'lit';
  import { app } from '../src/app';

  export const render = (
    config: Omit<RenderAppConfig, 'element'>
  ): Promise<string> =>
    renderApp(
      {
        ...config,
        element: html`<root-app></root-app>`,
      },
      app
    );
  ```
</details>


<details>
  <summary>vite.config.server.ts</summary>

  ```ts
  import { defineConfig } from 'vite';

  export default defineConfig({
    root: './src',
    envDir: '../',
    envPrefix: ['FES', 'SCOS', 'STORE'],
    build: {
      lib: {
        entry: '../server/render.ts',
        formats: ['iife'],
        name: 'storefront',
      },
      emptyOutDir: true,
      outDir: '../dist/server',
      ssr: '../server/render.ts',
    },
    ssr: {
      noExternal: true,
    },
  });
  ```
</details>

<details>
  <summary>package.json</summary>

  ```json
  {
    ...,
    "scripts": {
      "dev:ssr": "node --experimental-modules --experimental-specifier-resolution=node server/server",
      "build:ssr": "vite build -c vite.config.server.ts",
    },
    ...,
  }
  ```
</details>

### Quickstart

```
npm run dev:ssr - start dev server with SSR support
npm run build:ssr - builds for production with SSR support

npm run build:ssr && npm run dev:ssr --production - start dev server with SSR support in production mode
```
