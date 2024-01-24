---
title: "Oryx: Integrating components"
description: Oryx Components are build as web components
last_updated: Sept 20, 2023
template: concept-topic-template
---

Oryx components are _framework agnostic_, so they can be used in other web frameworks.

Oryx components are build as [web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components). Web components are a suite of standard web technologies supported by most browser vendors. The purpose of web components is to provide components in isolation so that they can easily integrate with other web technologies.

## Integrating Oryx components with other web frameworks

Thanks to the web-component-based architecture, Oryx components integrate with any web framework. You can integrate them with component frameworks, such as [React](https://react.dev/), [Vue.js](https://vuejs.org/), or [Angular](https://angular.io/).

You can also integrate Oryx components inside frontend meta frameworks, like [Next.js](https://nextjs.org/), [Nuxt.js](https://nuxt.com/), or [Astro](https://astro.build/).

{% info_block infoBox %}
While the integration of Oryx components is relatively straightforward, Spryker does not provide production-ready integration boilerplate code.

The integration of the [server-side rendering](/docs/oryx/architecture/oryx-server-side-rendering.html) part might be quite complex.
{% endinfo_block %}

## Integrating Oryx components with content management systems

Oryx can render content from other systems, like a headless content management system (CMS). More importantly, Oryx components can render inside the content provided by a CMS.

When rich content, like markdown, contains Oryx components, the components are rendered as is together with the content. This allows for rich content integrations, like rendering a carousel of upsell products in the middle of storytelling content.

You can use Oryx components inside rich content from an external CMS. The content is rendered inside Oryx, but any Oryx components inside the content are rendered transparently. This does not require any integration effort.

The following example shows Oryx components next to standard markdown.

```markdown
## Markdown example with an integrate Oryx Product images

Lorem ipsum dolor sit amet, consectetur adipiscing elit...

<oryx-product-images sku="086_30521602"></oryx-product-images>

Duis aute irure dolor in reprehenderit in voluptate velit...
```

The next example shows the integration of compositions with layout. We use the product list component with a configuration to render it in a carousel.

```markdown
## Markdown example with a carousel of products

Lorem ipsum dolor sit amet, consectetur adipiscing elit...

<oryx-product-list layout="carousel"></oryx-product-product-list>

Duis aute irure dolor in reprehenderit in voluptate velit...
```
