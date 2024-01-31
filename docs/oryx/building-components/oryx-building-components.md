---
title: "Oryx: Building components"
description: Components are the building blocks of Oryx applications
last_updated: Sep 19, 2023
template: concept-topic-template
---

Oryx provides a fully component-based architecture where only components are used to render the application. Components are the building blocks used to create modular and reusable elements. The components are primarily concerned with UI/UX, leaving business logic and integrations to other application layers.

Oryx contains a library of standard components organized and distributed in [packages](/docs/oryx/getting-started/oryx-packages.md). There are different [types of components](/docs/oryx/building-components/oryx-component-types.md), including a design system. The components are built with powerful UI/UX features:

- Responsive design
- Themes support using [design tokens](/docs/oryx/building-applications/styling/oryx-design-tokens.md)
- [Typography](/docs/oryx/building-applications/styling/oryx-typography.md)
- [Icon system](/docs/oryx/building-applications/styling/oryx-icon-system.md)
- Internationalization (i18n) features:
  - [Locales](/docs/oryx/architecture/dependency-injection/oryx-service-layer.md)
  - Number and price formatting
  - Directionality: left-to-right versus right-to-left
- Accessibility features:
  - Dark and light mode
  - [Color contrast](/docs/oryx/building-applications/styling/oryx-color-system.md)
  - Keyboarding
  - Screen reader support

The components are rendered inside [compositions](/docs/oryx/building-pages/oryx-compositions.md) and [pages](/docs/oryx/building-pages/oryx-pages.md). The pages, organization, and layout of the components are provided in standard [feature sets](/docs/oryx/oryx-feature-sets.md). When you install an Oryx application, the feature sets are available in the [presets](/docs/oryx/building-applications/oryx-presets.md) package.

You can customize the components with a custom theme, style rules, [component options](/docs/oryx/building-components/oryx-managing-component-options.md), or component logic. You can also [implement custom components](/docs/oryx/building-components/oryx-implementing-components.md) and add them to the application.

The components are built as web components, which makes them highly reusable in other web frameworks and systems. For more details, see [Integration of components](/docs/oryx/building-components/oryx-integrating-components.html).

Oryx provides a reactive framework and is designed to work efficiently in a single page application architecture. To ensure _reactivity_ throughout the application, Oryx rerenders only  fragments of the components that are affected by the changing application state. For more details, see [key concepts of reactivity](/docs/oryx/architecture/reactivity/key-concepts-of-reactivity.html).
