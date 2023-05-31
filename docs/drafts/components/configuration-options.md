# Introduction

Components are highly configurable, which allows them to be reused in different context and business models. Default component options are provided but can be further configured in the application. Additionally, configuration presets can be defined in so-called presets, to pre-configure a business model such as b2b or b2c.

The component configuration contains options of any kind. An important type of configuration are _feature flags_. Feature flags are ordinary (boolean) options, allowing to enable or disable a component feature. Feature flag options allow to introduce new component feature without introducing breaking changes; when a new feature of a component is introduced in a minor release, the feature is disabled by default, so that you need to explicitly opt-in to use the feature. Once a feature becomes commoditized in a future major release, the feature flag option might becomes default.

# Configuring Options

There are three ways to configure options in the Oryx framework:

1. components are setup with default options
2. presets can be used to (partially) override the default options
3. applications can override the options by adding application specific configurations

This allows for more flexibility and control over the functionality of the application, and it also allows for easier testing and experimentation. This setup allows for a mixture of pre-configured experiences with application specific configuration.

## Default Options

The default options are part of the standard component implementation and are used as the default configuration for the component. They might change over time as part of a new major release, which is considered a breaking change and will be documented as such.

A decorator function is used to setup the component definition with default options. This setup provides a clean mechanism for component developers, but more importantly the default options can be read by the app orchestrator or other integrations.

The following code shows how to use the decorator function:

```ts
import { defaultOptions } from '@spryker-oryx/experience';

@defaultOptions({
  minChars: 2,
  completionsCount: 5,
  productsCount: 5,
  categoriesCount: 5,
  cmsCount: 5,
})
export class SearchBoxComponent {
  //
}
```

Application developers can use the decorator function to build their custom options.

## Presets

Presets are pre-defined configurations of options that can be imported and used to automatically configure options for a specific business model (e.g. b2c vs b2b). Presets override the default component options.

When new features are introduced in minor releases of the framework, a preset might be provided so that the new features can be used without knowing all the configuration options. This allows for a fast and convenient setup.

The following code shows an example how a predefined feature set (with options) is used inside an application. The feature set provides both the configured components as well a set of options that are applied to those components.

```ts
export const app = appBuilder().withFeature(b2cFeatures).create();
```

Specific presets might be provided for minor versions so that you can conveniently _opt-in_ on such configuration. By using a preset, you can ensure that you use the recommended configuration for your specific business model.

The presets use the following configuration to add default options to the application:

```ts
export const b2cFeatures: AppFeature[] = [
  featureA,
  featureB,
  {
    defaultOptions: {
      'oryx-search-box': {
        minChars: 2,
        completionsCount: 5,
        productsCount: 5
      }
    };
  }
```

## Application Configuration

Besides using presets, the application can be further configured. You can override default and presets with the `withOptions()` api. This api provides a convenient type safe argument, guiding the user while adding options for specific components.

For example, the following code shows how to disable the tax row in the cart totals feature using the application configuration:

```ts
export const app = appBuilder()
  .withOptions({
    'oryx-cart-totals': {
      enableTax: false,
    },
  })
  .create();
```

It is important to understand that both the presets and `withOptions()` api use the same mechanism under the hood. This means that the order of applying the configuration matters. When a feature is configured that contains options, the application configuration should be added afterwards, in order to take precedence over feature options.

# Conclusion

The Oryx framework offers different ways to configure options and uses this mechanism to provide new features without introducing breaking changes. By using these options, you can have more control over the functionality of your application, and you can also make it easier to test and experiment with different configurations. Additionally, by using default options, presets and application configurations, you can ensure that you are using the recommended configuration for your specific business model.
