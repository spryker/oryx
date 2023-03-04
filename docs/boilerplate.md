# Understanding Boilerplate in Oryx

"How to Create Maintainable and Upgradeable Applications"

## Introduction

Boilerplate refers to the _template_ code that is used to generate an application code that can be further customized. Changing boilerplate is convenient at first sight as the code is at hand, generated in your project repository. However, when upgrading to newer versions of the original code, it becomes challenging. If you've customize the boilerplate code and want to reapply a new version of the boilerplate, you have to merge the customizations with the boilerplate during every update to a new version of the application. This is a time-consuming and error-prone process that can slow down your development process and increase the risk of bugs.

## How we prevent boilerplate code

In Oryx, we use a few tactics to prevent boilerplate code. These tactics include:

1. bootstrap the application from npm packages rather than source.
2. Expose an appBuilder function to setup the [app orchestrator](./app-orchestrator.md) conveniently.
3. Provide [presets](./presets.md) for the standard application setup, including the feature sets and UI themes.
4. Provide the source code in a public repository ([github.com/spryker/oryx](https://github.com/spryker/oryx)) to enable developers to customize the code. The code is implemented with TypeScript and the types and interfaces are documented where ever needed to provide a good developer experience.
5. Allow for configuration of business logic and component behavior.
6. Allow for customizations by [dependency injection](./dependency-injection.md).

Most of the details around these tactics can be found elsewhere in the documentation. In the following sections you read more details on the boilerplate files that are needed.

### NPM Packages

One of the biggest sources of boilerplate code in any project is the application logic itself. In Oryx, we've separated out all the application logic into individual packages that are distributed on npm. These packages include components, business logic and integrations to the Spryker APIs.

By separating out the application logic in this way, we've eliminated the boilerplate code from your projects. Instead of writing code to handle basic functionality, you can simply install the appropriate package and use it directly in your code. And because the packages are distributed on npm and published with Semantic Versioning, you can be confident that upgrading to a new version of the framework won't break your code.

### Using Presets

Another source of boilerplate code in any project is the configuration required to get your application up and running. To simplify this process, we've introduced the concept of presets in Oryx.

Presets provide configurations and data structures that are designed to get you up and running quickly without providing a lot of configuration yourself. Presets can be considered as so-called "demo applications", as they typically represent a demo application for a specific business model (e.g. "b2c demo shop"). By using presets, you can quickly configure your application without writing a lot of boilerplate code. This is particularly great when you first start your project or want to demo or test things out.

### Using appBuilder

Finally, we provide an appBuilder function that can be used to set up your application in just a few lines of code. This function takes care of all the boilerplate code for you, including loading presets and configuring your application environment. By using `appBuilder()`, you can avoid writing boilerplate code and focus on building out your application's features.

By using these tactics, we've been able to greatly reduce the amount of boilerplate code required in Oryx projects. This makes it easier to maintain and upgrade your code over time, and allows you to focus on building out your application's features instead of worrying about the underlying framework.

## The minimal boilerplate code

When you create a new project in Oryx, you'll notice that there is a small amount of boilerplate code included by default. This boilerplate code is designed to provide the basic structure and configuration for your application, and can be customized as needed.

The boilerplate contains the following files, with the server files (SSR) being optional.

```
oryx-app/
├── app.ts
├── index.html
├── package.json
├── (server/)
│   ├──render.ts
│   └──server.ts
```

Here's a breakdown of the different bits of boilerplate code:

### `package.json`

The package.json file contains all the dependencies of a node js project. To simplify the dependency management, all dependencies are pulled through a single preset package. The preset package contains dependencies to all available oryx packages. This might not be the most optimal setup for your project over time, as it might contain a lot of "dead code", but for the start of your project it is very convenient. While you're getting experienced with Oryx over time, you could consider to build your own list of dependencies to get more fine-grained control. That being said, having unused dependencies in your project will not affect the build time or run time of your project. It is only an overhead during the npm install process.

The bare minimum package.json is setup with the following package.json:

```json
{
  "name": "my-oryx-app",
  "dependencies": {
    "@spryker-oryx/presets": "^1.0.0"
  },
  "devDependencies": {
    "vite": "^4.0.0"
  }
}
```

### `index.html`

The `index.html` file contains two lines of boilerplate code to bootstrap the application:

1. the `root-app` element
2. an import of the `app.ts` module

Both the `root-app` element and the `app.ts` module can be replaced with custom alternatives.

While the index.html can have a few more details, the bare minimum required code is shown in the snippet below:

```html
<html>
  <body>
    <root-app></root-app>
  </body>
  <script type="module" src="./app.ts"></script>
</html>
```

Oryx allows to be installed and used next to other application code. You could therefor have other elements and code that are not related to Oryx. Oryx is bootstrapped with the `oryx-app` root element by default, but you can set it up to use an alternative root element.

### `app.ts`

The `app.ts` file contains the bootstrap code of the application. Bootstrapping the application can be done with a the `appBuilder`, a function that allows to configure the application. While the `appBuilder` can be configured with a lot of fine-grained configurations, the bare minimum setup is very clean:

```ts
import { appBuilder } from '@spryker-oryx/core';
import { b2cFeatures } from '@spryker-oryx/presets';
import { storefrontTheme } from '@spryker-oryx/themes';

export const app = appBuilder()
  .withFeature(b2cFeatures)
  .withTheme(storefrontTheme)
  .withEnvironment(import.meta.env)
  .create();
```

In the boilerplate we see the following things:

- the usage of a standard _feature set_, which is provided by the `presets` package
- the usage of a standard theme, that applies a global color scheme and other theme design tokens to the application
- the usage of environment variables, to provide the backend base URLs to the application

### `server/render.ts` (optional)

If you're using server-side rendering (SSR) in your application, the server/render.ts file is the main entry point for this functionality. This file is responsible for rendering the initial HTML content for your application on the server, and can be customized as needed.

### `server/server.ts` (optional)

The server/server.ts file is another optional file that is used for SSR in your application. This file is responsible for setting up the server and handling incoming requests. You can customize this file to add additional functionality as needed.
