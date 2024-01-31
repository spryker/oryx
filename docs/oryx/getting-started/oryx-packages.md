---
title: "Oryx: Packages"
description: Use Oryx packages from npm to ensure you can easily upgrade to newer versions.
last_updated: Apr 19, 2023
template: concept-topic-template
redirect_from:
  - /docs/scos/dev/front-end-development/202311.0/oryx/oryx-packages.html
---



The Oryx code base is [available on Github](https://github.com/spryker/oryx/), and the code is published and distributed as npm packages. [npmjs.com](https://www.npmjs.com/) is a widely used registry of packages. Package managers, like npm, yarn, deno, or bun, are used to install dependencies in a project. The dependencies are typically configured in the [package.json](https://docs.npmjs.com/cli/v9/configuring-npm/package-json) file of an application.

Oryx packages are distributed under the [spryker-oryx](https://www.npmjs.com/org/spryker-oryx) organization. Each time a new version is published, the version number is bumped. For more information on the versioning strategy, see [Versioning](/docs/oryx/getting-started/oryx-versioning.html).

We recommend [installing](/docs/oryx/getting-started/set-up-oryx.html) the packages instead of cloning the Oryx repository. By depending on packages, you can easily upgrade to later versions of the packages.

## Layers

While packages are distributed as a flat list, there is an architectural hierarchy. The hierarchy protects from cyclic dependencies. Packages inside a layer can depend on sibling packages inside the layer without any issues. Packages can never depend on a layer above.

While the package layering might be irrelevant during your development, it might help you to better understand the package dependencies. The following diagram shows four package layers. The top layer is the [boilerplate application](/docs/oryx/getting-started/oryx-boilerplate.html), which is set up using a [preset](/docs/oryx/building-applications/oryx-presets.html).

{% include diagrams/oryx/packages.md %}

## Template packages

The template layer contains packages that can be used as quick starters for demos and projects. Templated packages follow semantic versioning and ensure upgradability. Some packages in the template layer, like presets, are opinionated and might not be used inside your final setup. Their main purpose is to quickly get up and running a standard frontend application.

| PACKAGES                                                               | LOCATION                    |
| ---------------------------------------------------------------------- | --------------------------- |
|                                                                        |                             |
| [Application](https://www.npmjs.com/package/@spryker-oryx/application) | `@spryker-oryx/application` |
| [Presets](https://www.npmjs.com/package/@spryker-oryx/presets)         | `@spryker-oryx/presets`     |
| [Labs ](https://www.npmjs.com/package/@spryker-oryx/labs)              | `@spryker-oryx/labs`        |
| [Themes ](https://www.npmjs.com/package/@spryker-oryx/themes)          | `@spryker-oryx/themes`      |

{% info_block infoBox %}

The Labs package is an exception. It consists of experimental or demo functionality and is not recommended to be used in production.

{% endinfo_block %}

## Domain packages

Domain packages provide components and service logic for certain domains. Organizing packages in domains improves the developer experience by making it easy to understand where to find a certain component or service. For example, the `product` domain package contains all product-related components, as well as product services and adapters that integrate with backend APIs.

| PACKAGES                                                         | LOCATION                 |
| ---------------------------------------------------------------- | ------------------------ |
| [Cart](https://www.npmjs.com/package/@spryker-oryx/cart)         | `@spryker-oryx/cart`     |
| [Checkout](https://www.npmjs.com/package/@spryker-oryx/checkout) | `@spryker-oryx/checkout` |
| [Content](https://www.npmjs.com/package/@spryker-oryx/content)   | `@spryker-oryx/content`  |
| [Order](https://www.npmjs.com/package/@spryker-oryx/order)       | `@spryker-oryx/order`    |
| [picking](https://www.npmjs.com/package/@spryker-oryx/picking)   | `@spryker-oryx/picking`  |
| [Product](https://www.npmjs.com/package/@spryker-oryx/product)   | `@spryker-oryx/product`  |
| [Search](https://www.npmjs.com/package/@spryker-oryx/search)     | `@spryker-oryx/search`   |
| [Site](https://www.npmjs.com/package/@spryker-oryx/site)         | `@spryker-oryx/site`     |
| [User](https://www.npmjs.com/package/@spryker-oryx/user)         | `@spryker-oryx/user`     |

## Platform packages

The platform layer contains the core packages of the Oryx framework. They provide the infrastructure to the whole system.

| PACKAGES                                                                           | LOCATION                          |
| ---------------------------------------------------------------------------------- | --------------------------------- |
| [Auth](https://www.npmjs.com/package/@spryker-oryx/auth)                           | `@spryker-oryx/auth`              |
| [Core](https://www.npmjs.com/package/@spryker-oryx/core)                           | `@spryker-oryx/core`              |
| [Experience](https://www.npmjs.com/package/@spryker-oryx/experience)               | `@spryker-oryx/experience`        |
| [Form](https://www.npmjs.com/package/@spryker-oryx/form)                           | `@spryker-oryx/form`              |
| [I18n](https://www.npmjs.com/package/@spryker-oryx/I18n)                           | `@spryker-oryx/i18n`              |
| [Indexed-db](https://www.npmjs.com/package/@spryker-oryx/indexed-db)               | `@spryker-oryx/indexed-db`        |
| [offline](https://www.npmjs.com/package/@spryker-oryx/offline)                     | `@spryker-oryx/offline`           |
| [push-notification](https://www.npmjs.com/package/@spryker-oryx/push-notification) | `@spryker-oryx/push-notification` |
| [router](https://www.npmjs.com/package/@spryker-oryx/router)                       | `@spryker-oryx/router`            |

## Base packages

The base layer contains packages that serve as utilities to all layers above. An important part of the base layer is the design system package (UI).

| PACKAGES                                                           | LOCATION                  |
| ------------------------------------------------------------------ | ------------------------- |
| [UI](https://www.npmjs.com/package/@spryker-oryx/ui)               | `@spryker-oryx/ui`        |
| [Utilities](https://www.npmjs.com/package/@spryker-oryx/utilities) | `@spryker-oryx/utilities` |
| [DI](https://www.npmjs.com/package/@spryker-oryx/di)               | `@spryker-oryx/di`        |
