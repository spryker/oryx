---
title: 'Oryx: Typography'
description: Typography design tokens are used for a consistent design system through the components in Oryx applications
last_updated: July 9, 2023
template: concept-topic-template
redirect_from:
  - /docs/scos/dev/front-end-development/202311.0/oryx/styling/oryx-typography.html
---

Typography is an important part of the look and feel of a web page. It contributes to the readability of text but also defines how page structure is perceived. Big headers typically go first and are perceived as more important, whereas smaller text seems less important.

The typography system lets you set up font size, weight, and line height globally. Components don't define _values_ for fonts directly in their CSS but use _design tokens_ to connect to the font values. Design tokens are CSS variables that you can configure in your project implementation.

Like all design tokens, the typography system is configurable by themes, so that selecting of a certain theme applies a unique set of typography settings to all components.

## Global font settings

Oryx is based on web components, using the shadow DOM. The shadow DOM doesn't leak out any styles outside a component, and components don't inherit styles from ancestor elements. However, there are a few exceptions. Font face and size, line height and color are the few CSS properties that cascade down the shadow DOM. This lets you define those rules high up in the DOM tree.

Because most design system components inherit typography from ancestor elements, you can provide the basis typography configuration in the root of the application. Oryx applications use the `<oryx-app>` component, which provides this setup:

```css
:host {
  font-family: var(--oryx-typography-body-font);
  font-weight: var(--oryx-typography-body-weight);
  line-height: var(--oryx-typography-body-line);
}
```

The values are based on design tokens, whcih can be configured in a theme. Themes provide a mechanism to have screen size specific tokens, which enables the components to have different typography for small, medium, and large screens.

{% info_block infoBox "" %}

Setting the _root font size_ is an exception in Oryx. Oryx avoids opinions about the root element and only provides styles to the `oryx-app` component. However, the `rem` unit requires the root font size to be set up in a web page. To ensure a configurable approach, Oryx uses `ThemeMetaInitializer` to accomplish this.

{% endinfo_block %}

<!-- TODO: we will add more information on the DefaultThemeMetaInitializer going forward in our docs -->

## Relative font size and line height

Application themes in Oryx are typically configured with relative sizes for font and line height, using `rem` or `em` units. In web development, using `rem` for font size and `em` for line height offers a flexible and proportional approach to typography. These units ensure consistent and harmonious typography throughout the components on a page.

### `rem` for font size

The `rem` unit, short for _root em_, is relative to the root font size of a document. By defining the root font size, all other font sizes specified using `rem` adapt proportionally.

For example, if the font size token of an `h3` is set to `1.2rem`, and the root font size is `15px`, the calculated font size for the `h3` becomes `18px`: `1.2 * 15`.

Using `rem` for font size provides several benefits:

1. Consistency: font sizes scale consistently across elements, maintaining proportional typography.
2. Accessibility: users can adjust the overall font size in their browser settings without affecting layout or readability.
3. Easy maintenance: adjusting the root font size automatically cascades changes to all elements using `rem`, reducing manual adjustments.

### `em` for line height

The `em` unit, short for _element em_, is relative to the font size of the current element. When line height is defined using `em`, the value is multiplied by the font size to determine the final line height.

For example, if the line height token of an `h3` is set to `1.5em`, and the font size is `18px`, the calculated line height for the `h3` becomes `27px`: `1.5 * 18`. The font size can be driven by a `rem` unit, and the browser calculates the rem value of the font size before calculating the line height.

Using `em` for line height offers the following advantages:

1. Proportional line heights: `em` adjusts line height proportionally to the font size, ensuring visually harmonious typography.
2. Vertical rhythm: `em` helps maintain a consistent vertical rhythm, creating a visually cohesive design.
3. Flexible adjustments: modifying the font size of an element automatically adjusts its line height, facilitating quick and consistent changes.

## Headings

HTML supports heading elements up to level 6: `<h1>`, `<h2>`, `<h3>`, etc. Screen readers and crawlers use headings to better understand the content and their coherence.

Oryx provides a number of heading and paragraph styles that are used in the design system and components:

- body
- small
- h1, h2, h3, h4, h5, h6
- subtitle
- subtitle-small
- bold
- caption

Each style of components and elements below is configurable by design tokens, using the following variables for h1. Examples:

- `--oryx-typography-h1-size`
- `--oryx-typography-h1-weight`
- `--oryx-typography-h1-line`

The headings get `margin: 0` to avoid any clashes in the component layout.

### Semantic HTML structure versus UI

The semantic usage of heading elements, like h1 or h2, defines the structure, which crawlers and screen readers use to interpret the content. This enables easier content navigation, especially for those with limited sight; screen readers guide and let them skip sections that are not of interest. Consequently, if the structure is not well formatted, for example, when `h3` is followed by an `h5`, it is considered a violation of accessibility best practices.

A valid structure, however, might conflict with the UI design. UI designers use the headings in combination with the layout, which means that their options are more advanced compared to the structure only. UI designers tend to ignore the structure and favor layout options to emphasize sections of a page.

For example, in a two-column layout, content in both sections has the same visual weight. However, in a left-to-right context, the content on the left is automatically more important.

To allow for a solution that can cope with both the right semantic structure and the visual design, heading elements might be styled with conflicting heading style rules. The following is an example:

<h2>Cart totals</h2>
<style>
  h2 {
    font-size: var(--oryx-typography-h3-size);
    font-weight: var(--oryx-typography-h3-weight);
    line-height: var(--oryx-typography-h3-height);
  }
</style>

The `Cart totals` heading has a structure of `h2`, while the visual appearance uses the h3 design tokens. This might look upside down, but it's intentionally done to have both a compliant and attractive UI.
