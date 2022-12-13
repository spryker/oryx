# Typography

Typography is an important part of the look and feel of a web page. It contributes to the readability of text but also plays an important role in how the structure of the page is perceived. Big headers typically go first and are perceived more important, where as smaller text seems less important.

The typography system allows to setup font size, weight and line height globally. Components do not define _values_ for fonts directly in their CSS, but use _design tokens_ to connect to the font values. Design tokens are (CSS) variables that allow for configurable values.

As all design tokens, the typography system is configurable by themes, so that a selection for a certain theme will apply a unique set of typography settings to all components.

The typography system allows for configurable font sizes. Typography is part of the theming.

## Global font settings

Oryx is based on web components, using the shadow DOM. The shadow DOM won't leak out any styles outside a component and components won't inherit styles from ancestor elements. There are however a few exceptions to this. Font face, size, height and color do actually cascade down the shadow DOM. This allows for defining those rules high up in the DOM tree.

The base font definition can therefore be set globally inside the root of the application. The standard `<root-app>` component specifies the bare minimum CSS rules, but their values are driven by design tokens:

```css
:host {
  font-family: var(--oryx-typography-font-face);
  font-size: var(--oryx-typography-font-size);
  font-weight: var(--oryx-typography-font-weight);
}
```

The CSS variables are provided by themes, or can be customised in the application setup. The standard font-size in most themes is `14px`.

## Headings

Html supports heading elements up to level 6 (`<h1>`, `<h2>`, `<h3>`, etc.) as well as a subtitle. The headings play an important role in the structure of an html page. It is used by screen readers and crawlers to better understand the content and their coherence. Designers, however, have more tools than headings alone to a apply structure, using layout and alternative UI elements.

The `<oryx-heading>` component is a design system component that can be used to create consistent headings throughout the experience. Each heading is rendered by design tokens, so that the font size, weight and line-height can be configured in a theme definition.

### Relative font size and line height

Font sizes and line height of headings are configured with relative sizes, using the `em` unit. For example, if the font-size of the `h1` token is set to `2.857em`, it means that it will become `40px` if the relative font-size is `14px`. The same goes for line-height. Similarly, when the line-height is set to `1.2em`, it will use the (calculated) `40px` from the h1, which results in a line-height of `48px`.

**note**: While `rem` (_root_ `em`) is a fair alternative to `em` it does not work out of the box in oryx, as oryx does not control the _root_ of the page. `rem`-based sizes can however be configured and controlled in themes.

### Appearance vs structure

The underlying structure of the typography is important to users with limited sight; screen readers require a strict DOM structure and do not allow to skip headers in the structure. An H3 for example cannot be followed by an H5, as it will cause an accessibility violation. This strict structure might not be required for UI design as the layout of the page often helps with structuring content. In fact, UI designers often ignore the structure of the page, and use heading levels in a random order, just to satisfy their needs. This is actually fair, as they also layout to accommodate the structure, so from a pure design perspective, there's often a different perspective on the heading levels.

To allow for a flexible but compliant design, the oryx heading component support a structure (`tag`) and an optional `appearance`. The `appearance` dictates the UI, regardless of the element tag.

Appearance can also be applied to medium - large screens only, using the `md-appearance` attribute.

### Examples

The most common approach to add headings to the UI is using the native heading (H1 - H6) and slot it into the heading component. The heading component will provide the styles for the headings, so that the host component remains clean.

```html
<oryx-heading>
  <h1>Heading title goes here</h1>
</oryx-heading>
```

Alternatively, the heading can be provided using a tag attribute or property. The heading component will render the associated element in the shadow dom and will provide the same styling. Using a tag rather than slot in the element has the advantage that the heading level can be specified by the data (e.g. experience builder).

```html
<oryx-heading tag="h1"> Heading title goes here </oryx-heading>
```

The last option is to provide the heading appearance, regardless of the actual `tag`. This will render the tag as-is, but applies the styles based on the UI design.

```html
<oryx-heading appearance="h5">
  <h3>This heading appears as an H5</h3>
</oryx-heading>

<oryx-heading appearance="h5"> This text appears as an H5 </oryx-heading>

<oryx-heading tag="h3" appearance="h5">
  This text renders as an h3, but appears as an H5
</oryx-heading>

<oryx-heading md-appearance="h5">
  <h3>
    This heading appears as an H5 on for medium (and larger) screen-size devices
  </h3>
</oryx-heading>
```

### Standard typography values

The heading definitions for the storefront theme are based on a `14px` font size. The relative font size is using `em`, the table below illustrates the relative sizes for the absolute sizes that the designs require.

### Small screen

| token    | font size | relative font size | line height | relative line height | weight |
| -------- | --------- | ------------------ | ----------- | -------------------- | ------ |
| H1       | `22px`    | `1.571em`          | `30px`      | `1.364em`            | `600`  |
| H2       | `18px`    | `1.286em`          | `26px`      | `1.444em`            | `700`  |
| H3       | `16px`    | `1.143em`          | `22px`      | `1.375em`            | `600`  |
| H4       | `14px`    | `1em`              | `22px`      | `1.571em`            | `600`  |
| H5       | `14px`    | `1em`              | `22px`      | `1.571em`            | `700`  |
| H6       | `12px`    | `0.857em`          | `16px`      | `1.333em`            | `600`  |
| subtitle | `12px`    | `0.857em`          | `16px`      | `1.333em`            | `600`  |

### Medium (and up) screen

| token    | font size | relative font size | line height | relative line height | weight |
| -------- | --------- | ------------------ | ----------- | -------------------- | ------ |
| H1       | `40px`    | `2.857em`          | `48px`      | `1.2em`              | `600`  |
| H2       | `30px`    | `2.143em`          | `36px`      | `1.2em`              | `600`  |
| H3       | `22px`    | `1.571em`          | `30px`      | `1.364em`            | `500`  |
| H4       | `18px`    | `1.286em`          | `26px`      | `1.444em`            | `500`  |
| H5       | `16px`    | `1.143em`          | `24px`      | `1.5em`              | `600`  |
| H6       | `16px`    | `1.143em`          | `24px`      | `1.5em`              | `500`  |
| subtitle | `12px`    | `0.857em`          | `16px`      | `1.333em`            | `600`  |
