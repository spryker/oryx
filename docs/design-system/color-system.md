# Colors system

An important part of the application user interface are the colors. Colors are used everywhere in the components and are important to express the brand identity. To ensure that you can adjust the colors to your needs throughout the application, a configurable color system is provided.

The color system allows to change colors globally. The components do not define color _values_ directly in their CSS, but use _design tokens_ to connect to the color values. Design tokens are CSS variables that enable configurable values.

The main entities in the color system are:

- **Color groups**: named colors, for example, the _primary_ color group.
- **color shades**: each color group can provide colors in different shades.
- **Color modes**: dark versus light mode.
- **Color palettes**: predefined colors that are used inside predefined themes.

## Color groups

The framework supports 10 different color groups. The color grouping helps both designers and developers to quickly identify a color by it's name. The actual colors for those groups are not relevant for the color system and are part of specific theme configurations.

| Color group | Description                                                                                                                                                                                                                                                                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primary     | The primary color accent which is often related to the corporate or brand identity. This color is also used for call-to-action buttons.                                                                                                                                                                                                            |
| Secondary   | The secondary color is used to add subtle differences in the UI next to the primary color. The secondary color is used sporadically to add little accents.                                                                                                                                                                                         |
| Canvas      | Canvas colors are typically used to fill the real estate of components, like the background or border color of an element. Some sort of gray is often used for canvas colors. The lightest canvas color is typically the global background of a page. Canvas colors are not used in the design system. The design system uses only neutral colors. |
| Neutral     | Similarly to the canvas color group, neutral colors are used to build the real estate of a component. The neutrals are mainly used for the design system.                                                                                                                                                                                          |
| Highlight   | The highlight color is used to highlight very specific parts in the UI. It is a variation of the accent, but used for very specific actions, like a price discount.                                                                                                                                                                                |
| Info        | The info color is used to indicate an information state of a component.                                                                                                                                                                                                                                                                            |
| Success     | The success color is used to indicate a success state of a component. Typically, green.                                                                                                                                                                                                                                                            |
| Warning     | The warning color is used to indicate the warning state of a component. Typically, yellow or orange.                                                                                                                                                                                                                                               |
| Error       | The error color is used to indicate an error state of a component. Typically, red.                                                                                                                                                                                                                                                                 |

Primary, neutral, canvas and ink are the colors that are mostly being used. The state color groups (info, warning, error, success and highlight) are rarely being used.

## Color shades

Each color group supports five shades. The shades are numbered from 100 to 500, where 300 is the base color. The base primary color is named `oryx-color-primary-300`.

Shade names, such as "light" or "lighter", are avoided to not ensure that the system works in both dark and light modes.

Not all shades are necessarily used by the components, but, for consistency, all color groups support the same number of shades.

| Color&nbsp;group | Description                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------ |
| 100              | The most gentle shade of a color group.                                                    |
| 200              | The second least gentle shade of a color group.                                            |
| 300              | The _base shade_ of a color group. Typically, the color that has the most pure saturation. |
| 400              | The second heaviest shade of a color group.                                                |
| 500              | The most heavy shade of a color group.                                                     |

## Color modes

Colors can be configured for light and dark modes separately. In an easy, more automated setup, colors shades could be inverted, where 100 would become 500. But designers might want to select colors precisely for dark mode.

## Color palettes

The color system comes with a couple of opinionated color palettes. The color palettes are configured in standard themes, but you can change the colors or provide your own theme.

To make sure the colors are accessible, we tested them for color contrast.

The color palette contains the following colors:

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

## Use color design tokens in CSS

The following example shows the usage of design tokens in CSS. The primary color is defined for the default state of the the button background color. When the user hovers over the button, the 400 color shade is used.

```css
button {
  background-color: var(--oryx-color-primary-300);
}
button:hover {
  background-color: var(--oryx-color-primary-400);
}
```

### Set up application colors

The color system is configured by themes. You can use predefined themes from the theme package and amend the theme in your application setup or build your own theme.

The following configuration example is based on an existing theme `storefrontTheme`, but the base primary color is changed for light and dark modes.

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
            primary: {
                300: 'hotpink'
            }
          },
        },
        {
          media: {
            mode: 'dark',
          },
          color: {
            primary: {
                300: 'deeppink'
            }
          },
        },
      ],
    },
  ])
  .create();

```
