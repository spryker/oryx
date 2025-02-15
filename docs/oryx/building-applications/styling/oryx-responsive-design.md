---
title: 'Oryx: Responsive design system'
description: Learn how to leverage Oryx's Responsive Design system to create stunning and user-friendly websites and applications that seamlessly adapt to different screen sizes and devices.
last_updated: October 3rd, 2023
template: concept-topic-template
---

Oryx's responsive design system empowers developers to implement designs for a variety of screen sizes and layouts in a convenient way. The design system provides various screen sizes, which you can redefine when needed. The CSS styles that are linked to the screen sizes adapt automatically to the provided configuration. This makes the design system useful for different types of applications. For example, if you need to build a business application for users with large screens, you can optimize the layout of your application to benefit from the available space.

The design system works closely with other styling techniques in Oryx, such as layouts, [design tokens](/docs/oryx/building-applications/styling/oryx-design-tokens.md), themes, and [typography](/docs/oryx/building-applications/styling/oryx-typography.md). Responsive design is not only a styling technique, but also plays a role in some specific design system components, like image components. These components add images for specific screens to optimize the experience per screen.

<!-- TODO: Add link to layout docs when they're published -->
<!-- TODO: Add link to themes docs when they're published -->
<!-- TODO: Add link to (design system) components docs when they're published -->

## Screen sizes

Oryx applications are designed for an optimized experience on a variety of devices, such as smartphones, tables, desktop, or even smartwatches. However, the responsive design system does not relate to specific devices, but to the associated screen sizes. Screen sizes are more reusable across devices. For example, a small screen design is used for mobile devices but can also be used for in-store displays in physical stores.

Oryx provides five t-shirt size values that are given by a generic `size` enumeration, which can be imported from the [utilities package](https://www.npmjs.com/package/@spryker-oryx/utilities).

| Screen      | Code | Enum breakpoint | Example devices                  |
| ----------- | ---- | --------------- | -------------------------------- |
| Extra small | `xs` | `Size.Xs`       | Small phone, smartwatch          |
| Small       | `sm` | `Size.Sm`       | Smartphone, in-store application |
| Medium      | `md` | `Size.Md`       | Tablet                           |
| Large       | `lg` | `Size.Lg`       | Desktop                          |
| Extra large | `xl` | `Size.Xl`       | Wide screen                      |

While the `xs` and `xl` sizes are available in the TypeScript enumeration, they are not used in most Oryx components and layouts. However, you can use the definitions to create an optimized user experience (UX) for these screen sizes. Moreover, you can introduce additional screen sizes when needed.

The actual definition per screen is provided by a breakpoint configuration. The breakpoint values are not used inside the component styles, as this doesn't let you change the breakpoints. Instead, you can create stylesheets per screen for a component. For more details, see [Providing component definitions](/docs/oryx/building-components/oryx-providing-component-definitions.md).

If you need to use the screen definitions in your custom code, you can use `ScreenService` provided by the [layout package](https://www.npmjs.com/package/@spryker-oryx/layout).

{% info_block infoBox "" %}

Screen sizes might be confusing in some cases. For example, when you browse an Oryx application on a wide screen in a smaller browser window, the physical screen size is not relevant because the browser viewport is used to indicate the screen size.

{% endinfo_block %}

## Breakpoints

Breakpoints define the specific screen sizes at which your website or application layout should adapt. Oryx's responsive design system provides default breakpoints for small, medium, and large screen sizes. You can adjust the defaults or introduce custom breakpoints to tailor the design system to your specific needs.

Breakpoints are configurable in themes. Oryx themes come with preconfigured breakpoints, but you can override the breakpoints in an additional theme configuration.

{% info_block infoBox "" %}

It may seem that breakpoints and their usage should be controlled by design tokens and used as CSS variables. Unfortunately, CSS variables can not be used inside media query definitions. This is the main reason why Oryx provides a configurable system to provide the breakpoint definitions.

{% endinfo_block %}

### Default breakpoints

Oryx provides the following default breakpoints for three screen sizes.

| Screen size | Breakpoints                      |
| ----------- | -------------------------------- |
| Small       | Smaller than `"768px"`           |
| Medium      | Between `"768px"` and `"1023px"` |
| Large       | Larger than `"1023px"`           |

The default breakpoints are given by the `defaultBreakpoints` object, which is available in the [themes](https://www.npmjs.com/package/@spryker-oryx/themes) package. The breakpoint values are configured in pixels.

```ts
import { Breakpoints, Size } from '@spryker-oryx/utilities';

export const defaultBreakpoints: Breakpoints = {
  [Size.Sm]: {
    max: 767,
  },
  [Size.Md]: {
    min: 768,
    max: 1023,
  },
  [Size.Lg]: {
    min: 1024,
  },
};
```

The breakpoint definition shows that you only need to define the required breakpoint min or max values. For example, there's no `min` value provided for small size, as it defaults to `0`. The same is true for the large screen, which starts with 1024&nbsp;px and supports all screens that are larger than 1024&nbsp;px.

### Custom breakpoints

By using custom breakpoints, you can create a responsive design that is tailored to your project's needs and provides an optimal UX across different devices and screen sizes.

Breakpoints are part of Oryx themes. All Oryx themes use the default configuration for breakpoints. You can provide a custom theme or an additional theme to be used on top of the standard themes. A custom theme can add a single breakpoint or redefine all breakpoints. In the following example, custom breakpoints are defined for extra small and small screen sizes. The small screen gets a minimum value, and the extra small only requires a maximum value because it starts with `0` by default.

```ts
import { Size } from '@spryker-oryx/utilities';

export const app = appBuilder()
  // ...
  .withTheme([storefrontTheme])
  .withTheme({
    breakpoints: {
      [Size.Xs]: {
        max: 575,
      },
      [Size.Sm]: {
        min: 576,
        max: 767,
      },
    },
  })
  .create();
```

## Building responsive designs

There are different techniques used to apply responsive designs in your pages and components:

- Components can implement different styles per screen size.
- Layouts can implement different styles per screen size.
- Images can have different sizes for optimized experiences per screen size.
- Experience structures can change per screen size.

### Responsive component styles

CSS allows to differentiate style rules per screen size using media queries. Media queries can handle different rules to associate CSS rules to a screen. In the context of responsive design, we're solely concerned with the width of the viewport. The media query rules are unfortunately not configurable, for example, by CSS variables. That's why, instead of providing hardcoded media query rules inside the styles, Oryx provides a mechanism to configure styles per screen size.

In order to associate styles to a specific screen size, you can link the styles in the [component definition](/docs/oryx/building-components/oryx-providing-component-definitions.md). The styles can be lazily loaded to avoid loading irrelevant styles.

```ts
export const selectComponent = componentDef({
  name: 'oryx-select',
  // ...
  stylesheets: [
    {
      rules: () => import('./styles').then((m) => m.screenStyles),
    },
  ],
});
```

The preceding example loads a file (`styles.ts`) that exports `const screenStyles`. The rules are expected to be an array of `CssStylesWithMedia` type, which is exported from the [utilities package](https://www.npmjs.com/package/@spryker-oryx/utilities). The lazy-loaded styles can contain either the styles for a single screen size or various screen sizes.

```ts
const screenStyles: CssStylesWithMedia[] = [
  {
    media: {
      [DefaultMedia.Screen]: Breakpoint.Sm,
    },
    css: css`
      :host {
        // put styles for small screens here
      }
    `,
  },
];
```

{% info_block infoBox "" %}

If your breakpoints are not likely to change, you might not need to align custom styles with the configurable breakpoints in your custom code. Then, you can avoid the configurable styles in the component definition and use standard media queries in your stylesheets.

{% endinfo_block %}

## Responsive layouts

The layout system has a built-in support for responsive layouts, which are driven by [design tokens](/docs/oryx/building-applications/styling/oryx-design-tokens.md). Layouts, like a grid or carousel, are designed to render different number of items per row or column, depending on the screen size. The number of items is configurable as a design token.

Other important responsive design concepts are the layout container and the page bleed. The layout container has a maximum width to avoid very wide layouts on large screen. The container size and minimum bleed are configurable as design tokens.

All design tokens are configurable per screen size, which allows you to control the layout per screen without changing component styles.

For more information about the layout system, see [Layout]()

## Responsive images

Images are shown in various places throughout the experience. For example, small icon-sized images appear in typeahead search results, increase in size when shown in a carousel or grid, and might blow up when shown on a Product Details page. Some images require fullscreen size, and others are only rendered inside a small layout.

The web platform has several ways to optimize image per viewport. Oryx components, like the `ProductMediaComponent` and `ImageComponent` design system components, are fully equipped to render optimized images for the right screen size and even device pixel density and current network connection speed.

It is however important to have the right images available. This can be done manually or automatically by integrating a third-party service.

{% info_block infoBox "" %}

The labs package contains an integration with Cloudinary that could be interesting to evaluate in this context. Cloudinary has an HTTP API that you can use to fill in the right size and quality when you request an image. The media are pulled into Cloudinary CDN, which makes it a performant solution for both the generation and serving of the media.

The Cloudinary integration is an example implementation, which is why it's in the labs package.

{% endinfo_block %}

## Adaptive design

Adaptive Design is a technique used in web development to create user interfaces that adapt to specific devices or screen sizes. Developers create multiple fixed layouts or templates optimized for specific devices or screen resolutions. These layouts are served to users based on their device characteristics like screen size, device type, or browser capabilities. Because elements can be rearranged, resized, or even hidden, this approach allows for a more precise control over the UX on different devices.

Adaptive design offers more control and customization for specific devices, but Oryx does not fully support it. For example, Oryx does not have native knowledge about specific device characteristics like device type or browser capabilities. Responsive design is considered a very mature technique that does not need much in addition. However, in order to dictate the visibility of certain elements on various screen sizes, Oryx supports visibility rules for compositions and components.

You can use visibility rules in the experience data to selectively hide elements on specific screen sizes, providing a level of adaptability within the responsive design framework. The visibility rules can be applied to the experience data you create for [pages](/docs/oryx/building-pages/oryx-pages.md) and [compositions](/docs/oryx/building-pages/oryx-compositions.md). The rules can be configured to hide a composition or component for a specific screen size, next to other more advanced visibility rules.

The following example shows how to create a simple visibility rule for a specific screen.

```ts
export const headerTemplate = {
  id: 'header',
  // ...
  components: [
    type: 'oryx-content-link',
    // ...
    options: {
        // ...
        rules: [{ query: { breakpoint: Size.Sm }, hide: true }],
    },
  ],
};
```

<!-- TODO: add a link to visibility docs whenever that is available -->
