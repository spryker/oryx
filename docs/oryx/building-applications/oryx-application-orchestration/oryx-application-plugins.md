---
title: Oryx application plugins
description: Plugins of the Oryx Application
template: concept-topic-template
redirect_from:
  - /docs/scos/dev/front-end-development/202311.0/oryx/oryx-application-orchestration/oryx-application-plugins.html
---



When you create an Oryx Application with the `appBuilder()` function, it creates an instance of `App`. `App` is a a shell that can be enhanced with custom plugins: `AppPlugin`. Plugins let you extend Oryx core behavior without modifying the core code of the framework.

The following built-in plugins are provided by the Oryx framework:

- [`ComponentsPlugin`](#components-plugin)
- [`InjectionPlugin`](#injection-plugin)
- [`ResourcePlugin`](#resource-plugin)
- [`ThemePlugin`](#theme-plugin)

For ordinary application development, there's no need to develop custom plugins.

## Components plugin

`ComponentsPlugin` orchestrates the lazy loading of components. The plugin registers all the component definitions and loads the implementation whenever required in the DOM.

The plugin exposes the `registerComponents()` API, which registers components. For example, register components:

```ts
import { ComponentsPlugin } from '@spryker-oryx/core';

app.requirePlugin(ComponentsPlugin).registerComponents([
  ... // <-- Component definitions go here
])
```

## Injection plugin

The `InjectionPlugin` plugin manages the dependency injection system (DI). DI lets you customize core application logic without rewriting it.

The plugin exposes the following APIs:

- `getInjector()`: returns the injector it has created.
- `createInjector()`: recreates the injector with configured providers.

For example, get the injector and inject something from it:

```ts
import { InjectionPlugin } from '@spryker-oryx/core';

app.requirePlugin(InjectionPlugin).inject(...)
```

The plugin exposes the `App` instance as an `AppRef` token to make the main application reference available throughout the application:

```ts
import { AppRef } from "@spryker-oryx/core";
import { inject } from "@spryker-oryx/di";

class MyService {
  constructor(private app = inject(AppRef)) {
    // Use `app` here
  }
}
```

## Resource plugin

`ResourcePlugin` adds support for application resources, like images. The plugin lazy-loads resources into the application whenever they're needed.

When resources are added to an Oryx application, this plugin is automatically configured and used.

The plugin exposes the following APIs:

- `getResources()`: gets all registered resources.
- `getGraphicValue()`: loads graphical resources.

For example, get all resources:

```ts
import { ResourcePlugin } from "@spryker-oryx/core";

app.requirePlugin(ResourcePlugin).getResources();
```

## Theme plugin

`ThemePlugin` adds the support for application themes. When a theme is added to an Oryx application, this plugin is automatically configured and used.

The plugin exposes the following APIs:

- `getIcons`: gets all configured icons.
- `getIcon`: gets a specific configured icon.
- `getBreakpoints`: gets configured breakpoints.
- `resolve`: resolves a component theme.
- `normalizeStyles`: normalizes styles.
- `generateMedia`: interpolates media queries.

For example, get all configured icons:

```ts
import { ThemePlugin } from "@spryker-oryx/core";

app.requirePlugin(ThemePlugin).getIcons();
```

## Plugin development

You can create custom plugins to change the behavior of an Oryx application. The `AppPlugin` is a simple interface that defines the following:

- `getName()`: Its name string.
- `apply()`: main life-cycle method.
- `destroy()`: Optional cleanup method.

When a plugin is registered to the Oryx application builder, it is _applied_ by invoking the `AppPlugin.apply()` method with an `App` instance as an argument. Then, the plugin behaves as configured.

The following additional plugin life-cycle methods are invoked around the main lifecycle of _all_ plugins:

- `AppPluginBeforeApply` is invoked before the main life cycle.
- `AppPluginAfterApply` is invoked after the main life cycle.

{% info_block warningBox "" %}

Instead of relying on the order of registration of the plugins to the Oryx application builder, always use extra plugin life-cycle methods to establish the order if necessary.

{% endinfo_block %}


For more information on how to access registered plugins, see [interacting with plugins](/docs/oryx/building-applications/oryx-application-orchestration/oryx-application.html#interact-with-plugins).

## Plugin use cases

Plugins are used for the following:

- To execute code when Oryx application starts up.
- To interact with existing Oryx plugins.
- To extend functionality of an Oryx application by building a custom plugin or extending existing Oryx plugins.
