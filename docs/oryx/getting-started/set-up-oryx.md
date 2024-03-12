---
title: Set up Oryx
description: Learn how to set up Oryx using a boilerplate project
last_updated: Apr 3, 2023
template: howto-guide-template
redirect_from:
  - /docs/scos/dev/front-end-development/202311.0/oryx/set-up-oryx.html
---

This document describes how to set up an environment for developing in the Oryx framework. We provide a [boilerplate project](https://github.com/spryker/oryx-starter) that helps you quickstart the development. It contains minimum dependencies and configuration to install a standard Oryx application.

## Prerequisites

- [Node.js](https://nodejs.org/) or a compatible Javascript runtime
- npm package manager

## Install Oryx with the boilerplate project

1. Download the boilerplate project and install dependencies:

```shell
git clone https://github.com/spryker/oryx-starter && \
cd oryx-starter && \
npm i
```

2. Run the application:

```shell
npm run dev
```

The application gets available at `localhost:3000`.

For more information about the boilerplate project, see the [boilerplate guide](/docs/oryx/getting-started/oryx-boilerplate.md).

## Builders and bundlers for Oryx

The recommended build tool for Oryx is [Vite](https://vitejs.dev/). However, Oryx is compatible with a wide variety of build tools, like rollup, parcel or webpack. Since Oryx uses exports in every package to split logical parts to sub-packages, the build tool you choose must support [exporting entry points](https://nodejs.org/api/packages.html#package-entry-points) in `package.json`.

## Packages

Oryx [packages](/docs/oryx/getting-started/oryx-packages.md) are distributed on [npmjs.com](https://www.npmjs.com/org/spryker-oryx).
