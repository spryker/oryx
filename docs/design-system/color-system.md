# Colors system

An important part of the application user interface are the colors. Colors are used everywhere in the components and are important to express the brand identity. In order to ensure that you can change the colors to your needs throughout the application, a configurable color system is provided.

The color system allows to change colors globally. The components do not define color _values_ directly in their CSS, but use _design tokens_ to connect to the color values. Design tokens are (CSS) variables that allow for configurable values.

The main entities in the color system are:

- **Color groups**: named colors, for example the _brand_ color group
- **color shades**: each color group can provide colors in different shades
- **Color modes**: dark versus light mode
- **Color palettes**: predefined colors that are used inside predefined themes

## Color groups

The framework supports 10 different color groups. The color grouping helps both designers and developers to quickly identify a color by it's name. The actual colors for those groups are not relevant for the color system, and are part of specific theme configurations.

| Color group | Description                                                                                                                                                                                                                                                                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Brand       | The primary color accent which is often related to the corporate or brand identity. This color is also used for call-to-action buttons.                                                                                                                                                                                                                      |
| Accent      | The accent color can add subtle differences in the UI next to the brand color. The brand is the main color used to add color, where as the accent color is used rarely to add little accents int the UI                                                                                                                                                      |
| Canvas      | Canvas colors are typically used to fill the real estate of components, e.g. the background or border color of an element. Some sort of gray is often being used for canvas colors. The lightest canvas color is typically the global background of a page. Canvas colors are not being used in the design system, the design system will only use neutrals. |
| Neutral     | Similarly to canvas color group, neutral colors are used to build the real estate of a component. The neutrals are mainly in use for the design system.                                                                                                                                                                                                      |
| Highlight   | The highlight color is used to highlight very specific parts in the UI. It is a variation of the accent, but used for very specific actions, such as a price discount                                                                                                                                                                                        |
| Info        | The info color is used to indicate an information state of a component.                                                                                                                                                                                                                                                                                      |
| Success     | The success color is used to indicate an success state of a component. This is typically green.                                                                                                                                                                                                                                                              |
| Warning     | The warning color is used to indicate the warning state of a component. This is typically yellow or orange.                                                                                                                                                                                                                                                  |
| Error       | The error color is used to indicate an error state of a component. This is typically red.                                                                                                                                                                                                                                                                    |

Brand, neutral, canvas and ink are the colors that are mostly being used. The state color groups (info, warning, error, success and highlight) are rarely being used.

## Color shades

Each color group supports five shades. The shades are numbered from 100 to 500, where 300 is the base color. The base brand color is named `oryx-color-base-300`.

Shades names, such as "light" or "lighter" are avoided to not ensure that the system work in both dark and light mode.

Not all shades are necessarily used by the components, but for consistency all color groups support the same amount of shades.

| Color&nbsp;group | Description                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| 100              | The most gentle shade of the color group.                                                          |
| 200              | The 2nd least gentle shade of the color group.                                                     |
| 300              | The **base shade** of the color group, it's typically the color that has the most pure saturation. |
| 400              | The 2nd heaviest shade of the color group.                                                         |
| 500              | The most heavy shade of the color group.                                                           |

## Color modes

Colors can be configured for both light and dark mode. In a easy, more automated setup, colors shades could be inverted (i.e. 100 becomes 500), but designers might want to select colors precisely for dark mode.

## Color palettes

The color system comes with a couple of (opinionated) color palettes. The color palettes are configured in standard themes, but nothings stops you from changing the colors or provide your own theme.

The colors in the color palette have been tested for color contrast to ensure accessible colors.

The color palette contains the following 10 colors:

<style>c {display:block;width:50px;height:50px;background-color: var(--c)}</style>

| Color  | 100                          | 200                          | 300                          | 400                          | 500                          |
| ------ | ---------------------------- | ---------------------------- | ---------------------------- | ---------------------------- | ---------------------------- |
| White  | <c style="--c:#FFFFFF;"></c> | <c style="--c:#F5F5F5;"></c> | <c style="--c:#E7EAEE;"></c> | <c style="--c:#DCE0E5;"></c> | <c style="--c:#DBDBDB;"></c> |
| grey   | <c style="--c:#B7BEC9;"></c> | <c style="--c:#B2B2B2;"></c> | <c style="--c:#71747C;"></c> | <c style="--c:#4C4C4C;"></c> | <c style="--c:#333333;"></c> |
| Green  | <c style="--c:#F1F8F7;"></c> | <c style="--c:#94DDC0;"></c> | <c style="--c:#11856E;"></c> | <c style="--c:#1C6C5C;"></c> | <c style="--c:#004628;"></c> |
| Blue   | <c style="--c:#EAF1FA;"></c> | <c style="--c:#A2C6E5;"></c> | <c style="--c:#0064B4;"></c> | <c style="--c:#005090;"></c> | <c style="--c:#034072;"></c> |
| Red    | <c style="--c:#F8E9E6;"></c> | <c style="--c:#F19D8F;"></c> | <c style="--c:#C72712;"></c> | <c style="--c:#A03523;"></c> | <c style="--c:#782214;"></c> |
| Orange | <c style="--c:#FEF0E6;"></c> | <c style="--c:#FFAA70;"></c> | <c style="--c:#FF6800;"></c> | <c style="--c:#B7540F;"></c> | <c style="--c:#894618;"></c> |
| Yellow | <c style="--c:#FFF7E6;"></c> | <c style="--c:#FEDC93;"></c> | <c style="--c:#FDBE36;"></c> | <c style="--c:#E4A41C;"></c> | <c style="--c:#D88D00;"></c> |

## Implementation guidance

### Using color design tokens in CSS

An example if the usage of design tokens in CSS is given below. In this example, the button background color is setup with the brand color for the default state. When the user hovers over the button, the 400 color shade is used.

```css
button {
  background-color: var(--oryx-color-brand-300);
}
button:hover {
  background-color: var(--oryx-color-brand-400);
}
```

### Setup colors in your application

The color system is configured by themes. You can use predefined themes from the theme package and amend the theme in your application setup, or build your own theme.

An example of color configuration is shown below. This configuration uses an existing theme (`storefrontTheme`) and changes the base brand color for both light and dark mode.

```ts
import { storefrontTheme } from '@spryker-oryx/themes';

export const app = appBuilder()
  .withFeature([...])
  .withTheme([
    storefrontTheme,
    {
      name: 'custom',
      designTokens: [
        {
          color: {
            brand: {
                300: 'hotpink'
            }
          },
        },
        {
          media: {
            mode: 'dark',
          },
          color: {
            brand: {
                300: 'deeppink'
            }
          },
        },
      ],
    },
  ])
  .create();

```
