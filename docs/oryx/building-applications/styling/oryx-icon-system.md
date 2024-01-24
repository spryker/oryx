---
title: "Oryx: Icon system"
description: Icons are used for a consistent design system throughout components in Oryx applications
last_updated: July 29, 2023
template: concept-topic-template
redirect_from:
  - /docs/scos/dev/front-end-development/202311.0/oryx/styling/oryx-icon-system.html
---

Icons provide clear visual cues, enhance user interactions, and save screen space. Oryx offers a sophisticated icon system that ensures a consistent design across all components of an  application.

## Icon component

Icons are rendered using `IconComponent`, a design system component designed for this purpose. To display an icon, use the `type` attribute to specify the icon's name:

```html
<oryx-icon type="rocket"></oryx-icon>
```

`IconComponent` can render icons using either an icon font or SVG. When rendered as SVG, icons are displayed in a 24x24 pixels viewport.

## Icon sizes

The icon system is standardized around the 24x24 pixels format. Icons can be scaled to fit alternative sizes with three pre-defined sizes available:

| SIZE NAME | PIXELS |
|-|-|
| `xs`: extra small | 16x16 |
| `md`: medium | 20x20 |
| `lg`: large | 24x24 |

To maintain consistency, `IconComponent` provides the `--oryx-icon-size` CSS variable, which applies to both font-based and SVG-based icons. This feature enables you to control icon sizes throughout UI effortlessly, ensuring icons remain clear and sharp across different contexts and devices.

You can control the icon size through the `size` attribute or by providing the CSS variable. If both the size attribute and the CSS variable are used, the CSS variable takes precedence.

```html
<oryx-icon type="rocket" size="md"></oryx-icon>

<div style="--oryx-icon-size:40px">
  <oryx-icon type="rocket"></oryx-icon>
</div>
```

## Font-based icons versus SVG icons

Oryx supports both font-based icons and SVG icons, letting you choose the most suitable approach for each icon in your application.

### Font-based icons

Font-based icons are a popular choice due to their ease of use and the availability of a wide range of icons. They offer great quality and scalability, staying sharp at various sizes. Additionally, font-based icons can be easily colored using CSS, seamlessly integrating with UI themes.

Oryx leverages [Material symbols](https://fonts.google.com/icons) and [Font Awesome icons](https://fontawesome.com/). However, you can also add other icon fonts. Material Symbols are built with Variable fonts, enabling developers to edit font characteristics like line weight and fill through CSS.

When using font-based icons, make sure to consider the potential impact on performance. Since all icons in the font are loaded at once, it may affect the initial page loading time. Proper optimization strategies are essential to mitigate this issue.

### SVG icons

SVG icons offer several advantages, including the ability to load icons individually or in sprite sheets, which optimizes HTTP requests and improves performance. Server-side rendering of SVG icons results in optimal output for performance, leading to faster loading times. Being vector-based, SVG icons maintain their quality and sharpness at various sizes, making them ideal for responsive designs. Like font-based icons, SVG icons can also be colored using CSS, enabling seamless integration with UI themes.

Compared to font-based icons, creating and maintaining SVG icons requires more intricate design work. Developers need to find balance between icon complexity and performance to ensure a smooth user experience.

### Image icons

Oryx does not provide support for using images as icons. Images lack scalability and often become pixelated or blurry when resized, making them unsuitable for responsive design and different screen sizes. Moreover, images are fixed in size, limiting their versatility and adaptability to various UI elements. In contrast, the font-based and SVG icon techniques provide better performance and customization options, making them the preferred choice for icons.

## Icon colors

In Oryx, icons are seamlessly integrated into the main Document Object Model (DOM), which means they can inherit colors from ancestor HTML elements. To customize an icon's color, you can use standard CSS or leverage the [color system](/docs/oryx/building-applications/styling/oryx-color-system.html). If no explicit color is provided, the icon inherits its color from the parent element.

Here's an example of how to apply colors using standard CSS or the `--oryx-icon-color` variable:

```html
<oryx-icon type="rocket" style="color: red"></oryx-icon>

<div style="color: blue">
  <oryx-icon type="rocket"></oryx-icon>
  <div style="--oryx-icon-color: yellow">
    <oryx-icon type="cart"></oryx-icon>
  </div>
</div>
```

## Variable font styles

When using Material Symbols, you can configure the adjustable variable font styles of the icons:
* fill
* weight
* grade
* optical size

### Global configuration

You can provide the variable font styles globally using [design tokens](/docs/oryx/building-applications/styling/oryx-design-tokens.html):

```ts
import { appBuilder } from "@spryker-oryx/application";

export const app = appBuilder().withTheme({
  designTokens: [
    {
      icon: {
        weight: "100",
        fill: "1",
        grade: "0",
        optical: "48",
      },
    },
  ],
});
```

### CSS properties

Alternatively, you can configure the variable font styles for parts of the DOM by creating CSS properties in the stylesheet. Custom CSS properties are inherited by all descendants, making it easy to configure variable fonts for a DOM tree with a single style rule:

```html
<div style="--oryx-icon-fill: 1">
  <oryx-icon type="rocket"></oryx-icon>
  <div>
    <oryx-icon type="search"></oryx-icon>
  </div>
</div>
```

### Individual icon styling

You can also style the variable font for an individual icon by specifying style rules for a single icon type:

```ts
import { appBuilder } from "@spryker-oryx/application";
import { materialDesignIcons } from "@spryker-oryx/resources";

export const app = appBuilder().withTheme({
  icons: {
    resource: materialDesignIcons,
    resources: [
      {
        resource: {
          id: materialDesignIcons.id,
          styles: { fill: 1 },
        },
        types: ["person"],
      },
    ],
  },
});
```

## Icon configuration

You can configure one or multiple icon resources per theme. An icon resource can contain a reference to a font or provide SVG-based icons.

Here's an example of configuring a theme that uses `materialDesignIcons` for all icons, except for the cart icon, which is configured with a specific mapping:

```ts
export const customTheme: Theme = {
  icons: {
    resource: materialDesignIcons,
    resources: [
      {
        svg: true,
        mapping: {
          [IconTypes.Cart]: () => import("./icons/cart").then((s) => s.default),
        },
      },
    ],
  },
};
```

You can use the theme in the `appBuilder` configuration, on top of an existing theme, or as the main theme:

```ts
import { appBuilder } from "@spryker-oryx/application";
import { materialDesignIcons, storefrontIcons } from "@spryker-oryx/resources";

export const app = appBuilder().withTheme(customTheme).create();
```
