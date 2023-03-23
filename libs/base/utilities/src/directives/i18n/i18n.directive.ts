import { DirectiveResult } from 'lit/directive.js';
import { i18nInjectable, InferI18nContext } from '../../injectables';

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
): string | DirectiveResult {
  return i18nInjectable.get().translate(token, context);
}
