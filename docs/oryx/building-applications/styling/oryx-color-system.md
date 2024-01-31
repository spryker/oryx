---
title: "Oryx: Color system"
description: Color design tokens are used for a consistent design system throughout the components in Oryx applications
last_updated: July 9, 2023
template: concept-topic-template
redirect_from:
  - /docs/scos/dev/front-end-development/202311.0/oryx/styling/oryx-color-system.html
---




An important part of the application user interface is the colors. Colors are used everywhere throughout components and are important for a good user experience. To ensure that you can adjust the colors to your needs throughout the application, a configurable color system is provided.

The color system lets you set up the color values globally as well as override them per component. Components do not define _values_ for colors directly in their CSS but use [design tokens](/docs/oryx/building-applications/styling/oryx-design-tokens.md). Design tokens are (CSS) variables that are provided by themes, which you can customize in your project.

The color system comes with semantic color types and a consistent number of color steps. This results in a consistent naming system throughout all the components. The actual colors for those groups are not relevant to the color system and are part of the theme configuration. This lets you configure the colors in a global theme.

## Color palette

The color palette provides a number of colors that you can use to quickly set up an Oryx application with the colors of your choice. This is particularly useful to demonstrate and experience how consistently the color system is applied across all components. All colors in the color palette are fully accessible by default, both in light and dark modes.

To enable you to create fully accessible colors, we added a third-party open-source library: [Radix](https://www.radix-ui.com/docs/colors/palette-composition/scales). Radix contains a wide range of colors and neutrals that can be configured in Oryx.

### Color contrast

Color contrast is an important accessibility feature. When colors do not have enough contrast, users with limited sight might not be able to use the experience to its full extent.

Color contrast is based on two colors. The color system provides 13 color shades which can be used to create enough contrast. The Oryx design system and the application components are fully equipped to provide enough contrast, even if you configure an alternative color from the palette. However, if you provide a custom color, you should test its accessibility.

### Color mode

Colors can be provided for both light and dark modes. The dark mode is another important feature for accessibility and is supported by all colors in the color palette. Oryx applications can automatically adapt to the device mode, but you can also use the `ColorModeSelectorComponent` component to let the user manage the color mode manually.

## Semantic color types

There are eight semantic color types used in Oryx components:

| TYPE      | DESCRIPTION                        |
| --------- | ------------------ |
| Primary   | Typically represents the brand color of a website. This color is used as the call-to-action color in many components.                     |
| Secondary | Additional accent color that can be used for more color-full experiences. Oryx components rarely use the secondary color.                                 |
| Neutral   | Also known as "grays". The neutrals are used for the layout—for example, as a divider or background color. The Radix color system provides different neutrals that pair nicely with the color of choice, also known as "natural pairing". |
| Highlight | Used to highlight a    |
| Success   | One of the `AlertType` colors that is used in components that are driven by `AlertType`—for example, notification.                              |
| Info      | Similar to Success.                                             |
| Warning   | Similar to Success.                                               |
| Error     | Similar to Success.                                             |

## Color steps

Each color type comes in 13 values, also known as steps. Components might not use all the steps of a color, but there are enough to provide enough nuance and create accessible experiences.

The steps count from 0 to 12. In light mode, the steps go from light to dark: the higher the number, the darker the color. In dark mode, this is reversed.

The Radix color system provides 15 color scales that are designed with a white foreground text and 5 bright scales for black foreground text. The foreground color is provided by step 0. For the bright colors, this color is black, while for the other colors, it's white. In dark mode, this is reversed.

The color values can be of any supported color in the web platform, such as named colors like `red` or `blue`, hex color, HCL, or RBA. Oryx doesn't interfere with the provided colors but uses them as-is.

## Configure colors from the color palette

To change the colors in an Oryx application, you can configure the colors using the color palette. This is convenient and the recommended approach to quickly try out the color system.

```ts
import { appBuilder } from "@spryker-oryx/application";
import { colorPalette } from "@spryker-oryx/experience";

appBuilder().withTheme({
  designTokens: [
    {
      color: {
        primary: colorPalette.colors.sky,
        secondary: colorPalette.grays.slate,
      },
    },
  ],
});
```

## Configure custom colors

If your exact color of choice is not provided by the pallette, you can configure it using an extended configuration.

```ts
import { appBuilder } from "@spryker-oryx/application";

appBuilder().withTheme({
  designTokens: [
    {
      color: {
        primary: {
          light: {
            0: "lightblue",
            1: "blue",
            // etc, up to 12
          },
          dark: {
            0: "blue",
            1: "lightblue",
            // etc, up to 12
          },
        },
      },
    },
  ],
});
```

{% info_block infoBox "Light and dark mode colors" %}

Even though it's optional, we recommend providing both the light and dark mode colors, which are used if your application supports both modes.

{% endinfo_block %}

## Color design tokens


Each color type and its values are provided as a _design token_. [Design tokens](/docs/oryx/building-applications/styling/oryx-design-tokens.md) are provided as CSS variables to the root of the application. The color design tokens follow a consistent naming pattern to improve the integration into your components:


`--oryx-color-[type]-[step]`

For example, if you create a solid button with an accessible foreground text color, you can do the following:

```css
button {
  color: var(--oryx-color-primary-0);
  background: var(--oryx-color-primary-9);
}

button:hover {
  background-color: var(--oryx-color-primary-10);
}
```

The example shows the usage of design tokens in CSS. The primary color is defined for the default state of the the button background color. When the user hovers over the button, the 400 color shade is used. It works consistently with all colors. The buttons have a white foreground color on a colorful background. In case the background color is bright, the foreground color becomes black.
