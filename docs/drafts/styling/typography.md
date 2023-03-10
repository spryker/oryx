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

The CSS variables are provided by themes, or can be customized in the application setup. The standard font-size in most themes is `14px`.

## Headings

Html supports heading elements up to level 6 (`<h1>`, `<h2>`, `<h3>`, etc.) as well as a subtitle. The headings play an important role in the structure of an html page. It is used by screen readers and crawlers to better understand the content and their coherence. Designers, however, have more tools than headings alone to a apply structure, using layout and alternative UI elements.

The `<oryx-heading>` component is a design system component that can be used to create consistent headings throughout the experience. Each heading is rendered by design tokens, so that the font size, weight and line-height can be configured in a theme definition.

### Relative font size and line height

Font sizes and line height of headings are configured with relative sizes, using the `em` unit. For example, if the font-size of the `h1` token is set to `2.857em`, it means that it will become `40px` if the relative font-size is `14px`. The same goes for line-height. Similarly, when the line-height is set to `1.2em`, it will use the (calculated) `40px` from the h1, which results in a line-height of `48px`.

**note**: While `rem` (_root_ `em`) is a fair alternative to `em` it does not work out of the box in oryx, as oryx does not control the _root_ of the page. `rem`-based sizes can however be configured and controlled in themes.

### Semantic HTML structure versus UI

The semantic usage of heading elements (h1, h2, etc.) is important on the web. Crawlers and screen readers use the structure to interpreted the content. This is important to navigate the content, especially for those with limited sight; screen readers will guide them and allow to skip sections which are not of interest. Consequently, if the structure is not well formatted (e.g. a h3 followed by a h5), it violates with accessibility best practices.

A valid structure, however, might conflict with the UI design. UI designers use the headings in combination with layout, which means that their options are more advanced compared to the structure only. UI designers tend to ignore the structure and favor layout options to emphasize sections of the page.

An example would be a 2 column layout, where content in both sections have the same visual weight. However, based on their position, the content on the left (in the LTR-world) is automatically of more importance.

To allow for a solution that can cope with both the structure and the visual design, the heading component supports a mechanism to render the structure visually _as_ it was a different structure. It basically mimics an alternative typography as illustrated below.

```html
<oryx-heading as="h3">
  <h1>This heading appears as an h3</h1>
</oryx-heading>
```

The mimicking can be applied per screen size (lg, md, sm), for example if you only want to change the UI on small screens you could use:

```html
<oryx-heading as-sm="h3">
  <h1>This heading appears as an h3 on small screens</h1>
</oryx-heading>
```

### Examples

The most common approach to add headings to the UI is using the native heading (h1 - h6) and slot it into the heading component. The heading component will provide the styles for the headings, so that the host component remains clean.

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
<oryx-heading as="h5">
  <h3>This heading appears as an h5</h3>
</oryx-heading>

<oryx-heading as="h5"> This text appears as an h5 </oryx-heading>

<oryx-heading tag="h3" as="h5">
  This text renders as an h3, but appears as an h5
</oryx-heading>

<oryx-heading as-md="h5">
  <h3>
    This heading appears as an h5 on for medium (and larger) screen-size devices
  </h3>
</oryx-heading>
```

### Standard typography values

The heading definitions for the storefront theme are based on a `14px` font size. The relative font size is using `em`, the table below illustrates the relative sizes for the absolute sizes that the designs require.

### Small screen

| token    | font size | relative font size | line height | relative line height | weight |
| -------- | --------- | ------------------ | ----------- | -------------------- | ------ |
| h1       | `22px`    | `1.571em`          | `30px`      | `1.364em`            | `600`  |
| h2       | `18px`    | `1.286em`          | `26px`      | `1.444em`            | `700`  |
| h3       | `16px`    | `1.143em`          | `22px`      | `1.375em`            | `600`  |
| h4       | `14px`    | `1em`              | `22px`      | `1.571em`            | `600`  |
| h5       | `14px`    | `1em`              | `22px`      | `1.571em`            | `700`  |
| h6       | `12px`    | `0.857em`          | `16px`      | `1.333em`            | `600`  |
| subtitle | `12px`    | `0.857em`          | `16px`      | `1.333em`            | `600`  |

### Medium (and up) screen

| token    | font size | relative font size | line height | relative line height | weight |
| -------- | --------- | ------------------ | ----------- | -------------------- | ------ |
| h1       | `40px`    | `2.857em`          | `48px`      | `1.2em`              | `600`  |
| h2       | `30px`    | `2.143em`          | `36px`      | `1.2em`              | `600`  |
| h3       | `22px`    | `1.571em`          | `30px`      | `1.364em`            | `500`  |
| h4       | `18px`    | `1.286em`          | `26px`      | `1.444em`            | `500`  |
| h5       | `16px`    | `1.143em`          | `24px`      | `1.5em`              | `600`  |
| h6       | `16px`    | `1.143em`          | `24px`      | `1.5em`              | `500`  |
| subtitle | `12px`    | `0.857em`          | `16px`      | `1.333em`            | `600`  |
