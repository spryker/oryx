---
title: 'Oryx: Localization'
description: Localizations are decoupled from component implementations
template: concept-topic-template
last_updated: July 23, 2023
redirect_from:
  - /docs/scos/dev/front-end-development/202311.0/oryx/oryx-localization.html
---

Localization is the part of internationalization (`i18n`) that's concerned with creating variations of the same application in different locales.

While most localized content is managed in other systems, like product or content management systems, components often use small text fragments in the UI. The examples are static site labels or aria labels.

To make sure all components can be customized and localized, Oryx doesn't provide _any_ hardcoded text. Instead, components use _tokens_ that function as a reference to a text. When there's no localized text available for such a reference, Oryx renders the token in a human-readable format.

## Translation keys

Translation keys, also knows as _i18n tokens_, are used to resolve localized text. The tokens are created with the following conventions in mind:

- Tokens are written in English.
- Tokens are written in kebab-case format—for example, `my-token`.
- Tokens are organized by domains—for example, `cart.add-to-cart`.
- Tokens support context variables, which are wrapped in angle brackets in camelCase format. For example, `cart.totals.<count>-items`.

## Resolving translations from translation resources

The localization of labels is driven by the current language and the translation key. Translations are typically provided as lazy-loaded resources next to the component implementation. Although, they can aslo be added as part of the static resources that are loaded in Oryx. If the resources are loaded externally, they can be provided by static JSON files or a third-party service through an API.

Oryx uses the active application language to look up the available labels. When the language is `en`, the locales for English are resolved.

If a language resource can be resolved, the translation key is evaluated against the available translations in the resource using all "parts" of the key. For example, if a translation key contains multiple parts, like `cart.increase`, you can provide a global translation for just the `increase` part or for `cart.increase`. This mechanism allows for a single translation of `increase` that might affect multiple components. This provides a consistent and convenient translation mechanism while remaining flexible to add specific localizations for some components.

## Auto-conversion of translation keys

If a translation key doesn't match any of the translations, or if the i18n feature is not installed (which is the default behavior), the translation key is converted into a human-readable message.

The following examples show how the tokens are translated.

| TOKEN                       | CONVERTED LABEL |
| --------------------------- | --------------- |
| `cart.increase`             | Increase        |
| `cart.add-to-cart`          | Add to cart     |
| `cart.totals.<count>-items` | 5 items         |

This mechanism lets Oryx avoid distributing localizations as a standard package or as part of the boilerplate. Labels are quite opinionated and may change frequently over time, which may cause breaking changes. For 90% of the cases, the keys are fairly short and provide an OK experience.

{% info_block infoBox "" %}

The [Oryx labs package](https://www.npmjs.com/package/@spryker-oryx/labs) provides some localizations mainly for demonstration reasons. For more information on the labs package, see [Feature sets](/docs/oryx/building-applications/oryx-feature-sets.md).

{% endinfo_block %}

## Installing the i18n package

To use the i18n package, add `I18nFeature` to the app and configure translation resources using the loader function:

```ts
import { appBuilder } from '@spryker-oryx/application';
import { I18nFeature } from '@spryker-oryx/i18n';

export const app = appBuilder()
  .withFeature(
    new I18nFeature({
      // Here as example we are loading translations from TS modules
      load: (localeId) => import(`../i18n/${localeId}.ts`), // <-- Required part
    })
  )
  .create();
```

This gives you full flexibility of how and where to load your translation texts from. The `load` function returns a promise of a `{ default: I18nData }` type.

## Translation resources

To translate text in Oryx, you can provide translation data in a TS module.

```ts{% raw %}
export default {
  increase: "Increase",

  // using token parameters
  "cart.entry.<quantity>-items": "x {quantity}",

  // pluralization example
  "order.<count>-items":
    "Products ({count, plural, one {{count} item} other {{count} items}})",
};{% endraw %}
```

You can also load the text from a third-party translation engine.

The [globalize](https://www.npmjs.com/package/globalize) translation engine is based on the standardized [ICU message expressions](https://unicode-org.github.io/icu/userguide/format_parse/messages/). The ICU message format defines a standard syntax to handle common translation cases:

- Pluralization: for example, `You have {count} {count, plural, one {item} other {items}} in cart`.
- Selects: for example, `{gender, select, male {He} female {She} other {They}} invited you to party!`.

Other ICU capabilities, such as [number formatting](https://unicode-org.github.io/icu/userguide/format_parse/numbers/) or [date and time formatting](https://unicode-org.github.io/icu/userguide/format_parse/datetime/) can be loaded in addition. Most likely, it's not needed in your project, because Oryx uses the standard [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) API, which is widely supported.

## Using the i18n directive in components

Localized content uses [the fine-grained reactivity system](/docs/oryx/architecture/reactivity/reactivity.md). The localizations are updated as soon the active locale is changed; for example, when the user interacts with the localization selector, or when the `LocaleService.set()` API is used. All localized content in Oryx components is updated instantly without a page reload.

To support such fine-grained reactivity, a framework-specific implementation is required. Oryx provides an `i18n` Lit directive that's used inside components. Using this directive ensures that the DOM is aligned with the localizations in an efficient way. This requires the `@signalAware()` decorator on the component class. To simplify the integration, you can use `I18nMixin` in your component implementation. `I18nMixin` adds `@signalAware()` and exposes the `i18n` function as a method on the component. For more information about the `@signalAware()` decorator, see [Signals](/docs/oryx/architecture/reactivity/signals.md).

The following is an example of using i18n in a Lit component. The tokens are used both as attributes and plain text, and the example shows the usage with and without a token context.

```ts
import { I18nMixin } from '@spryker-oryx/utilities';

export class MyComponent extends I18nMixin(LitElement) {
  protected override render(): TemplateResult {
    return html`
      <button aria-label=${this.i18n('site.my-token')}>
        ${this.i18n('site.my-token-<count>', { count: 12 })}
      </button>
    `;
  }
}
```

## Localizing texts in vanilla JS components

The i18n directive uses `I18nService`. You can inject `I18nService` in JS or TS using [dependency injection](/docs/oryx/architecture/dependency-injection/dependency-injection.md). The service provides an observable that you can subscribe to.

```ts
import { inject } from '@spryker-oryx/injector';
import { I18nService } from '@spryker-oryx/i18n';

class Example {
  constructor(i18nService = inject(I18nService)) {
    i18nService
      .translate('domain.hello')
      .subscribe((text) => console.log(text));
  }
}
```

If a token requires context, you can pass the context as a second argument to the `translate` method.

```ts
i18nService
  .translate('domain.hello-<name>', { name: 'world' }))
  .subscribe((text) => console.log(text));
```
