import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import {
  I18nContext,
  i18nInjectable,
  I18nTranslation,
  I18nTranslationValue,
  InferI18nContext,
  Injectable,
} from '../../injectables';
import { computed, Signal, signal } from '../../signals';

/**
 * Internationalize token(s) with optional context object.
 *
 * Token should have a domain prefix separated by dot,
 * after that a readable token name should be used in kebab-case
 * (for ex.: `cart.add-to-cart`).
 *
 * By default last part of the token (right-most side after the last dot)
 * will be converted to a capitalized readable text
 * (for ex.: `cart.add-to-cart` -> `Add to cart`).
 *
 * If context is needed for a token use `<` and `>` to mark a prop in the last part of the token
 * (for ex.: to have `count` prop in context use it in token like `cart.<count>-items-in-cart`
 * which will produce a readable string as `5 items in cart` when `count=5`)
 *
 * _NOTE:_ This function uses signals so it requires `@signalAware()` decorator on the component.
 * You should use {@link I18nMixin} which will add `@signalAware()` decorator
 * and expose this function as a method on the component.
 *
 * @example
 * Inside a dom/text node:
 * ```ts
 * <div>${i18n('cart.add-to-cart')}</div>
 * ```
 * Inside attribute value:
 * ```ts
 * <div title="${i18n('cart.add-to-cart')}"</div>
 * ```
 * With context object:
 * ```ts
 * <div>${i18n('cart.<count>-items-in-cart', { count: 10 })}</div>
 * ```
 */
export function i18n<T extends string | readonly string[]>(
  token: T,
  context?: InferI18nContext<T>
): I18nTranslationValue {
  const i18nMap = i18nMapInjectable.get();
  const hash = getI18nTextHash(token, context);

  if (i18nMap.has(hash)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return i18nMap.get(hash)!();
  }

  const $result = signal(i18nInjectable.get().translate(token, context));
  const $text = computed(() => unwrapText($result()));

  i18nMap.set(hash, $text);

  return $text();
}

function unwrapText(result?: I18nTranslation): I18nTranslationValue {
  if (!result) {
    return '';
  }

  if (typeof result === 'string') {
    return result;
  }

  if ('text' in result) {
    if (result.hasHtml && typeof result.text === 'string') {
      return html`${unsafeHTML(result.text)}`;
    } else {
      return result.text;
    }
  }

  return result;
}

export const i18nMapInjectable = new Injectable<
  Map<string, Signal<I18nTranslationValue>>
>('oryx.i18n.map', new Map());

/**
 * Hash function for I18N token and context pair.
 */
export function getI18nTextHash(
  token: string | readonly string[],
  context?: I18nContext
): string {
  let contextHash = '$no-context$';

  if (context) {
    try {
      contextHash = JSON.stringify(context);
    } catch {
      // Cannot hash non serializable context
    }
  }

  const tokenHash = Array.isArray(token) ? token.join(',') : token;

  return `${tokenHash}|${contextHash}`;
}
