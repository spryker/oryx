import { ReactiveElement } from 'lit';
import { Type } from '../../misc';
import { signalAware } from '../../signals';
import { i18n } from './i18n.directive';

/**
 * I18n mixin to provide {@link i18n()} method to the component.
 *
 * @example
 * ```ts
 * import { I18nMixin } from '@spryker-oryx/utilities';
 * import { LitElement } from 'lit';
 *
 * export class ExampleComponent extends I18nMixin(LitElement) {
 *   render() {
 *     return html`<div>${this.i18n('foo.bar')}</div>`;
 *   }
 * }
 * ```
 */
export function I18nMixin<T extends Type<ReactiveElement>>(
  base: T & { [i18nMixinMark]?: boolean }
): Type<I18nMixinType> & T {
  if (base[i18nMixinMark] === true) {
    return base as Type<I18nMixinType> & T;
  }

  const i18n = I18nMixin.i18n;

  @I18nMixin.signalAware()
  class I18nMixinClass extends base {
    static [i18nMixinMark] = true;

    i18n(...args: Parameters<typeof i18n>) {
      return i18n(...args);
    }
  }

  return I18nMixinClass;
}
I18nMixin.signalAware = signalAware;
I18nMixin.i18n = i18n;

export interface I18nMixinType {
  i18n: typeof i18n;
}

const i18nMixinMark = Symbol.for('I18nMixin');
