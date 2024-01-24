---
title: "Oryx: Providing component definitions"
description: Components are registered in an Oryx application by a definition file
last_updated: Sept 19, 2023
template: concept-topic-template
---

Oryx components can be used in different ways. They can be configured in [pages](/docs/oryx/building-pages/oryx-pages.html) and [compositions](/docs/oryx/building-pages/oryx-compositions.html), used in components, or integrated in CMS content.

When a component is rendered for the first time, Oryx resolves the component definition from the registry and loads the associated implementation. With this, components are lazily loaded.

To register a [component implementation](/docs/oryx/building-components/oryx-implementing-components.html), you need to provide a component definition. The component definition requires a name and an implementation. The name is used as the web component element name and consists of two or more words separated by a dash. We recommend prefixing component names with a project, brand, or company name. For example, Oryx components are prefixed with `oryx-`.

{% info_block infoBox "Update definitions" %}
You can also update an existing component definition. To match an existing definition, you still need to provide a name.
{% endinfo_block %}

The following example shows where a component is registered, providing both the name and implementation.

```ts
import { componentDef } from "@spryker-oryx/utilities";

export const productIdComponent = componentDef({
  name: "oryx-product-id",
  impl: () => import("./id.component").then((m) => m.ProductIdComponent),
});
```

The [dynamic `import()` expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) is used to ensure the component is lazily loaded. Dynamic imports are used by build systems like [Vite](https://vitejs.dev/) to create a separate JavaScript chunk during the build. This allows to load the JavaScript chunk upon demand.

Lazy loading components is the recommended technique as it avoids loading all the application components at startup of the application. Components are only loaded when they are used, which increases the application's performance.

{% info_block warningBox "Static import of component files" %}

To prevent breaking the lazy loading principals, do not import component files _statically_.

{% endinfo_block %}

## Dynamic stylesheets

To build a [responsive design](/docs/oryx/building-applications/styling/oryx-responsive-design.html), a common practice is to specify different CSS rules per screen size. CSS supports [media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries) which can take a minimum and/or maximum width to determine the target screen size.

```css
@media (min-width: 768px) and (max-width: 1023px) {
  /* … */
}
```

CSS, however, supports only _static assignment_ of the minimum and maximum width. Because Oryx supports customizing the minimum and maximum of each screen size, using static minimum and maximum for width doesn't work. This is why hard-coded minimum and maximum values in stylesheets are avoided in Oryx. Instead, we recommend adding stylesheets per screen size _inline_ in the component definition. Alternatively, you can provide stylesheets per screen size as a dynamic import to gain a lazy-loaded experience.

The stylesheets written in component definitions are added on top of stylesheets that are added statically as part of the component implementation.

### Inline stylesheets

In the following example, the responsive styles are added in component definition. The stylesheets can have multiple rules, and each rule can configure a media query. In the example, the style rules are created for the small screen size. The actual size of the small screen is provided by Oryx based on the breakpoints that were configured for the small screen size.

```ts
export const cartEntriesComponent = componentDef({
  name: "oryx-cart-entries",
  impl: () => import("./entries.component").then((m) => m.CartEntriesComponent),
  stylesheets: [
    {
      rules: [
        {
          media: { screen: Size.Sm },
          css: css`
            oryx-cart-entry:first-child {
              border-top: 1px solid var(--oryx-color-neutral-6);
            }
            oryx-cart-entry:last-child {
              border-bottom: 1px solid var(--oryx-color-neutral-6);
            }
          `,
        },
      ],
    },
  ],
});
```

You can configure multiple rules targeting different screen sizes. The rules are expected to be an array of the `CssStylesWithMedia` type, which is exported from the [utilities package](https://www.npmjs.com/package/@spryker-oryx/utilities).

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

Adding styles to the component definition adds a little overhead to the initial bootstrap of an Oryx application. In most cases, we recommend importing the styles dynamically so that they're loaded when the component is used.

### Lazy-loaded stylesheets

In the following example, the stylesheets are lazily loaded. The component definition does not know about the rules and how they're assigned to various screen sizes because it's not needed when the definition is loaded. Only when the component is rendered, the stylesheets are imported and the rules are evaluated. Only the rules that are relevant at the given time are written inside the component.

```ts
export const linkComponent = componentDef({
  name: "oryx-link",
  impl: () => import("./link.component").then((m) => m.LinkComponent),
  stylesheets: [
    {
      rules: () => import("./styles/link.styles").then((m) => m.linkStyles),
    },
  ],
});
```

The imported file could contain the following rules. Oryx provides a small helper function to set up the rules per screen size, which returns an array of the `CssStylesWithMedia` type.

```ts
import { screenCss } from "@spryker-oryx/utilities";
import { css } from "lit";

const smallScreen = css`
  :host {
    display: block;
    position: sticky;
    inset-block-end: 0;
    padding: 10px;
    background: var(--oryx-color-neutral-1);
  }
`;

export const checkoutLinkScreenStyles = screenCss({
  sm: smallScreen,
  // md: ...
});
```
