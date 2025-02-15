---
title: Signals
description: Signals are reactivity API for components in Oryx.
template: concept-topic-template
last_updated: Jul 11, 2023
redirect_from:
  - /docs/scos/dev/front-end-development/202311.0/oryx/reactivity/signals.html
---

Signals offer a clean and efficient reactivity API for components in the Oryx framework. Signals contain values that can change over time. Whenever a new value is received, the component is automatically updated by the signal in an efficient way.

Signals provide a declarative syntax for component logic while seamlessly integrating with observables from domain services. This lets component developers avoid the more complex and verbose logic of reactive programming.

## Implementation of signals in Oryx

The Oryx implementation of signals has a core mechanism and a simplified API. The core is well-suited for advanced usage, while the simplified API is sufficiently robust for most components. This document focuses on the simplified API.

### Creating signals

To create a signal, use the `signal()` function. This function can either take a raw value or accept an observable.

Here's an example of creating a simple signal:

```ts
const counter = signal(1);
```

Changing the signal value:

```ts
counter.set(2);
```

Creating a signal from an observable:

```ts
const values = signal(observable$);
```

You can initialize signals with options to adjust their behavior:

- `equal`: allows for a custom equality function between two consecutive signal values. By default, strict comparison is used. Implementing your own function gives you control over when a signal updates the component. It can be beneficial to avoid unnecessary updates to the components when new and old values are practically identical.

- `initialValue`: this option is used when creating a signal from an observable. It sets the first value of the signal, so you don't have to wait for the observable to give a value.

Here's an example of using options:

```ts
const values = signal(observable$, {
  initialValue: 1,
  equal: (a, b) => a === b,
});
```

### Computed signals

A _computed signal_ derives its value from other signals. When a signal it depends on changes, it automatically reevaluates its value.

Here's an example of a computed signal:

```ts
const counter = computed(() => 3 * counter(1));
```

Computed signals can also convert observables to signals transparently:

```ts
const counter = computed(() => productService.get({ sku: productSku() }));
```

In the preceding example, `productSku` is a signal, and `productService.get` returns an observable.

Computed signals can use the same set of options as regular signals.

### Effects

Effects are functions that run whenever a signal's value changes.

Here's an example:

```ts
const counter = effect(() => {
  console.log('counter changed', counter());
});
```

You can configure effects using options to modify their behavior:

- `defer`: if set to `true`, the effect doesn't run until you explicitly call the `start()` method.
- `async`: if set to `true`, the effect runs asynchronously.

Example:

```ts
const counter = effect(
  () => {
    console.log('counter changed', counter());
  },
  { defer: true, async: true }
);
```

## Using signals in components

Oryx provides directives like `@signalAware` and `@elementEffect` to seamlessly integrate signals and effects with Lit components. These directives help manage reactivity and side effects, leading to cleaner and more efficient code.

### `@signalAware` directive

The `@signalAware` decorator provides additional functionality when using signals in components.

```ts
@signalAware()
class MyComponent extends LitElement {}
```

This decorator is required to make a component work with signals as expected. With the decorator, the component automatically detects signals and renders changes whenever a signal alters. It does this intelligently, considering only the signals relevant to the last render.

Some Oryx domain components are not using this decorator directly, as it is already applied to some common domain mixins, like `ContentMixin` or `ProductMixin`.

### `@elementEffect` directive

The `@elementEffect` directive integrates effects with component lifecycles for seamless management. It activates an effect when a component is connected to the DOM and deactivates it once the component is disconnected.

```ts
class MyComponent extends LitElement {
  /* ... */
  @elementEffect()
  logProductCode = () => console.log('Product code ', this.$product().code);
}
```

In the preceding example, the `logProductCode` effect starts automatically as soon as `MyComponent` connects to the DOM. It logs the product code each time the `$product` signal updates. When `MyComponent` disconnects from the DOM, the effect stops.
