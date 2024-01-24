---
title: "Oryx: Presets"
description: Presets are used to install predefined applications
template: concept-topic-template
last_updated: Apr 4, 2023
redirect_from:
  - /docs/scos/dev/front-end-development/202311.0/oryx/oryx-presets.html
---


The [presets package](https://www.npmjs.com/package/@spryker-oryx/presets) contains standard feature sets and resources that are used to create sample applications without writing [boilerplate](/docs/oryx/getting-started/oryx-boilerplate.html). Presets might be too opinionated to use for a production application, but they let you get started quickly.

Presets are typically used to demonstrate or try out Oryx applications. In production applications, the boilerplate is set up in a more optimized way, by leaving out the features that are not used.

## Dependencies

Presets are provided in a separate [npm package](https://www.npmjs.com/package/@spryker-oryx/oryx-presets.html).

The standard boilerplate uses the presets as the single package to install Oryx applications. To simplify the installation, the preset application contains dependencies on _all_ [Oryx npm packages](https://www.npmjs.com/org/spryker-oryx). Because a production application is unlikely to use all the packages, it makes sense to leave out the unneeded ones.

## Feature sets

A feature set contains a group of features that can be added with a single reference. A good example of using a feature set is provided in the boilerplate code:

```ts
import { appBuilder } from "@spryker-oryx/core";
import { b2cFeatures } from "@spryker-oryx/oryx-presets";

export const app = appBuilder().withFeature(b2cFeatures).create();
```

The `b2cFeatures` feature set contains a list of features that exposes all the available B2C features:

```ts
export const b2cFeatures: AppFeature[] = [
  productFeature,
  cartFeature,
  checkoutFeature,
  userFeature,
  ...
```

Feature sets also contain static experience data. Experience data includes the structure and layout of the components of an application, such as pages and sections. By utilizing the static experience data provided by the presets, you don't need to set up any boilerplate code. Moreover, we avoid hardcoded page structures which enables personalized experiences.

For more information about feature sets, see [Feature sets](/docs/oryx/building-applications/oryx-feature-sets.html).

## Themes

A _theme_ represents the global visual appearance of an application, including typography, colors, and other specific design elements, such as the color of a form field's placeholder. Themes are built with [design tokens](/docs/oryx/building-applications/styling/oryx-design-tokens.html), which are configurable values that are used in CSS properties. Configuring these design tokens lets you customize a theme and align the application and its components with your brand identity or specific design requirements.

To apply a theme to your Oryx application, you can import it from the preset package and use it during the application setup:

```ts
import { appBuilder } from "@spryker-oryx/core";
import { b2cFeatures, b2cTheme } from "@spryker-oryx/oryx-presets";

export const app = appBuilder()
  .withFeature(b2cFeatures)
  .withTheme(b2cTheme)
  .create();
```

Themes help maintain a consistent and coherent visual experience throughout your application. They provide a centralized way to manage and apply design tokens, ensuring a unified look and feel across components and screens.

## Resources

Most web applications use a `/public` folder to host static resources. This requires a folder in the boilerplate code or a process to generate it, which is not easy to upgrade over time.

Resources are an alternative approach, which allows for lazy loading of web resources into Oryx applications. The most common example of a resource is an image or icon.

Resources are lazily loaded, so that the runtime performance is not affected when a lot of resources are used.

You can add resources to your application with the `appBuilder()` API:

```ts
import { appBuilder } from '@spryker-oryx/core';

const app = appBuilder()
  .withFeatures(...),
  .withResources(myResources);
  .create();
```

As an application developer, you might want to create your own resources.

```ts
import { Resources } from "@spryker-oryx/core";

const myResources: Resources = {
  graphics: {
    logo: {
      source: () =>
        import(
          "/docs/oryx/my-logo"
        ).then((m) => m.default),
    },
    otherImg: {
      source: () =>
        import(
          "/docs/oryx/my-other-img"
        ).then((m) => m.default),
    },
  },
};
```
