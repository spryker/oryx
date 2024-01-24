---
title: "Oryx: Feature sets"
description: Feature sets are collections of standard features
last_updated: May 24, 2023
template: concept-topic-template
redirect_from:
  - /docs/scos/dev/front-end-development/202311.0/oryx/oryx-feature-sets.html
---



A _feature set_ is a group of related features that can be added to an Oryx application with a single reference. Feature sets simplify the process of setting up an application by reducing the amount of [boilerplate code](/docs/oryx/getting-started/oryx-boilerplate.html) required to configure and initialize the application.

There are two types of feature sets: domain and application feature sets.

## Domain feature sets

A _domain feature set_ is an aggregation of the features related to a certain functionality or domain. For example, the product feature set exposes all available product features. This includes components and the associated business logic.

## Application feature sets

An _application feature set_ is an aggregation of the features related to a certain business model, such as B2C, B2B, marketplace, or fulfillment. Such feature sets are usually bigger and can include features from different domain feature sets.

Application feature sets can be seen as _demo apps_, because one such set lets you quickly set up a project without developing. However, a standard feature set might be too opinionated for your production application, which is why you might want to extend an existing set or create your own. For more details about creating feature sets, see [Create feature sets](#create-feature-sets).

### Available application feature sets

Oryx includes predefined feature sets that cover common use cases for web applications. The application feature sets are provided in the [presets package](/docs/oryx/building-applications/oryx-presets.html). The following feature sets are available:

- b2cFeatures: features commonly used in B2C applications.
- fulfillmentFeatures: features used in PWAs, used for picking products for fulfillment.

## Static Experience Data

Feature sets contain static experience data. Experience data includes the structure and layout of the components of an application. Feature sets provide all the static pages data that is required for the application experiences. For example, the `b2cFeatures` feature set comes with the following static data:

- Home page
- Search page
- Category page
- Product Details page
- Cart page
- Checkout page
- Login page

Application feature sets reuse each other's pages and introduce their own.

Static experience data is provided using the `ExperienceStaticData` injection token. Although feature sets provide standard experience data, you can provide your own using the same mechanism:

```ts
const app = appBuilder()
  .withFeatures({
    providers: [
      {
        provide: ExperienceStaticData,
        useValue: [header, footer, ...pages],
      },
    ],
  })
  .create();
```

Here's an example of static experience data for the Login page:

```ts
export const loginPage = {
  type: "Page",
  meta: {
    title: "Login Page",
    route: "/login",
    description: "Login Page Description",
  },
  options: {
    data: {
      rules: [{ layout: "flex", padding: "30px 0" }],
    },
  },
  components: [
    {
      type: "oryx-auth-login",
      options: {
        data: {
          rules: [{ width: "50%", margin: "auto" }],
        },
      },
    },
  ],
};
```

To better understand the data structure, see [Compositions](/docs/oryx/building-pages/oryx-compositions.html).

By utilizing the static experience data provided in Oryx presets, you can easily set up the overall structure and layout of your application, including common sections like the header and footer, without having to write the code from scratch.

## Labs

The labs package provides experimental features that are not designed for production environments. Experimental features may evolve into standard feature sets over time, but this is not guaranteed. You can use a labs feature set in your demos, POCs, or local development.

## Create feature sets

In addition to the provided feature sets, you can create custom sets tailored to your business requirements. To create a custom set, create an array of feature objects that implement the `AppFeature` interface and pass it to the `withFeature()` method of the `appBuilder()` object. For example:

```ts
import { appBuilder } from "@spryker-oryx/core";
import {
  customFeature1,
  customFeature2,
} from "/docs/oryx/my-features";

const customFeatures = [customFeature1, customFeature2];

const app = appBuilder().withFeature(customFeatures).create();
```
