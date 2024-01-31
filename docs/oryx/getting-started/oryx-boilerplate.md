---
title: "Oryx: Boilerplate"
description: Create maintainable and upgradeable applications using the Oryx boilerplate
last_updated: Apr 3, 2023
template: concept-topic-template
redirect_from:
  - /docs/scos/dev/front-end-development/202311.0/oryx/oryx-boilerplate.html
---


Boilerplate refers to the _template_ code that is used to generate application code which can be further customized. At first sight, changing boilerplate is convenient as the code is at hand, generated in your project repository. However, when upgrading to newer versions of the original code, it becomes challenging. If you customized the boilerplate code and want to reapply a new version of the boilerplate, you have to merge the customizations with the new version during every update. This is a time-consuming and error-prone process that can slow down your development process and increase the risk of bugs.

The Oryx boilerplate is provided in the [Composable Frontend repository](https://github.com/spryker/oryx-starter).

## How we prevent boilerplate code

In Oryx, we use the following tactics to prevent boilerplate code:

1. Bootstrap the application from [npm packages](https://www.npmjs.com/org/spryker-oryx) instead of source.
2. Expose a function to set up the [app orchestrator](/docs/oryx/building-applications/oryx-application-orchestration/oryx-application-orchestration.html) conveniently.
3. Provide [presets](/docs/oryx/building-applications/oryx-presets.html) for the standard application setup, including the feature sets and UI themes.
4. Provide the source code in a [public repository](https://github.com/spryker/oryx) to enable developers to read the source code.
5. Provide configurable components and business logic.
6. Allow for customizations with [dependency injection](/docs/oryx/architecture/dependency-injection/dependency-injection.html).

By using these tactics, we greatly reduced the amount of boilerplate code required in Oryx projects. This simplifies maintaining and upgrading code over time, and lets you focus on building features instead of maintaining the underlying framework.

### NPM Packages

One of the biggest sources of boilerplate code in a project is the application logic. In Oryx, we separated out all the application logic into individual packages that are [distributed on npm](https://www.npmjs.com/org/spryker-oryx). These packages include components, business logic, and integrations to the backend APIs.

By separating out the application logic, we eliminated the boilerplate code from your projects. Instead of writing code to handle basic functionality, you can install the needed packages and use it in your code. And because the packages are distributed on npm and published with [Semantic Versioning](https://semver.org/), you can be confident that upgrading to a new version of the framework won't break your code.

### Presets

Another source of boilerplate code is the configuration required to get your application up and running. To simplify this process, we introduced the concept of presets in Oryx.

The [preset packages](https://www.npmjs.com/package/@spryker-oryx/oryx-presets.html) provide configurations and data structures that are designed to get your project up and running quickly without providing a lot of configuration yourself. Presets can be considered as "demo applications", as they typically represent a demo application for a specific business model, like a B2C Demo Shop. By using presets, you can quickly configure an application without writing any code. This is useful for starting the first project, running a demo, or for testing things out.

### appBuilder

Finally, we provide an appBuilder function that can be used to set up your application in just a few lines of code. This function takes care of all the boilerplate code, including loading presets and configuring your application environment. By using `appBuilder()`, you can avoid writing boilerplate code and focus on building the features.

## The minimal boilerplate code

When you create a project in Oryx, there is a small amount of boilerplate code by default. This boilerplate code is designed to provide the basic structure and configuration for your application, and can be customized as needed.

The boilerplate contains the following files, with the server side rendering (SSR) files being optional.

```
oryx-app/
├── app.ts
├── index.html
├── package.json
├── server/ (optional)
│   ├──render.ts
│   └──server.ts
```

The following is a breakdown of the different bits of the boilerplate code.

### `package.json`

`package.json` contains all the dependencies of the project. To simplify the dependency management, all dependencies are pulled through a single preset package. The preset package contains dependencies to all available Oryx packages. This might not be the most optimal setup over time, as it might contain a lot of "dead code", but it is a convenient starting point. As you are getting experienced with Oryx, you can consider creating a narrowed down list of dependencies.

That being said, having unused dependencies in your project does _not_ affect the build time or run time of your project. It is only an overhead during the installation process.

The bare minimum `package.json` includes the following dependencies:

```json
{
  ...
  "dependencies": {
    "@spryker-oryx/oryx-presets": "^1.0.0"
  },
  "devDependencies": {
    "vite": "^4.0.0"
  }
  ...
}
```

{% info_block infoBox %}

We recommend fronting the dependencies with a caret notation (`^`), so that the latest _minor_ release is pulled on each installation.

{% endinfo_block %}


Vite is the recommended build system, but you can use alternative build systems. For more details, see [Set up Oryx](/docs/oryx/getting-started/set-up-oryx.html).

### `index.html`

`index.html` contains two lines of boilerplate code to bootstrap the application:

1. The `root-app` element.
2. An import of the `app.ts` module.

Both the `root-app` element and the `app.ts` module can be replaced with custom alternatives.

While `index.html` can have a few more details, the following is the required bare minimum:

```html
<html>
  <body>
    <root-app></root-app>
  </body>
  <script type="module" src="/docs/oryx/building-applications/oryx-application-orchestration/oryx-application.ts"></script>
</html>
```

Oryx can be installed and used next to other applications' code. You could therefore have other elements and code that are not related to Oryx.

### `app.ts`

`app.ts` contains the bootstrap code of the application. The application can be bootstrapped with `appBuilder`, a function that configures the application. While the configuration of `appBuilder` can be fine-tuned to small details, the following is the bare minimum setup:

```ts
import { appBuilder } from "@spryker-oryx/core";
import { b2cFeatures } from "@spryker-oryx/oryx-presets";
import { storefrontTheme } from "@spryker-oryx/themes";

export const app = appBuilder()
  .withFeature(b2cFeatures)
  .withTheme(storefrontTheme)
  .withEnvironment(import.meta.env)
  .create();
```

This configuration uses a standard _feature set_ and _theme_. The feature set and theme are opinionated and might not be the production setup you're looking for, but it's a great starting point.

### SSR boilerplate

If you're using SSR in your application, you need to build and serve the application with different code. The boilerplate provides a minimum customizable setup to accomplish this:

- `server/render.ts`: Renders the initial HTML content for your application on the server.
- `server/server.ts`: Sets up the server and handles incoming requests.

If you use Vite, in `package.json`, you can add an npm script to build and serve the SSR server:

```json
"scripts": {
  "build:ssr": "vite build -c vite.config.server.ts",
  "serve:ssr": "ts-node --experimentalSpecifierResolution node --esm server/server",
}
```
