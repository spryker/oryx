---
title: "Oryx: Design tokens"
description: Design tokens provide a centralized and consistent approach for styling components in Oryx applications.
last_updated: July 24, 2023
template: concept-topic-template
redirect_from:
  - /docs/scos/dev/front-end-development/202311.0/oryx/styling/oryx-design-tokens.html
---



Design tokens provide a powerful system for achieving consistent and customizable styles throughout an Oryx application. They are extensively used inside the [color system](/docs/oryx/building-applications/styling/oryx-color-system.md), typography, icons, and many more. Ensuring a clean separation between styles and components, design tokens make it easier to manage and maintain the application's design system. This document focuses on the structure and usage of design tokens in Oryx.

## CSS variables

Design tokens are provided as CSS variables in the application code. The variables follow a structured naming convention to ensure consistency. To avoid naming conflicts with third-party variables, they are prefixed with `oryx` and are written in kebab-case.

The variables are written in the root element of the application, the `oryx-app` component by default. The variables are inherited by all descendants of the root component. This makes it convenient to access the variables throughout the entire application. At the same time, they can be overridden at any element in the application.

If you like to reuse the variables outside the root element of the application, or if you are not using the `oryx-app` as the root, you can bootstrap the application using an alternative root:

```ts
import { appBuilder } from "@spryker-oryx/core";

appBuilder().withAppOptions({ components: { root: "body" } });
```

## Usage of design tokens

Design tokens are used extensively throughout Oryx components to achieve a consistent and cohesive visual experience. Instead of hardcoding style values directly in component CSS, design tokens are used as CSS variables to define the styles. This way, you can easily change the visual appearance of the entire application by adjusting the corresponding design token values.

The following example shows how to avoid hardcoded style values by using design tokens:

```css
.button {
  background-color: var(--oryx-color-primary-9);
  font-size: var(--oryx-typography-h1-size);
}
```

The CSS variables are inherited throughout all descendants, but you can override the value anywhere in the DOM tree. The following example shows how to override a design token anywhere in the DOM.

```html
<div style="--oryx-color-primary-9: red">
  <button>Primary 9 color has become red</button>
</div>
```

## Themes

Design tokens are organized in themes. The Oryx [preset package](/docs/oryx/building-applications/oryx-presets.md) provides standard themes to get you started. You can use a standard theme, customize a standard theme, or create your own.

<!-- TODO: add a note link to the theme docs once its ready -->
