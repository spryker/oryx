import { Type, hydrate, signalAware, ssrShim } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { DirectiveResult } from 'lit/directive.js';
import { UnsafeHTMLDirective, unsafeHTML } from 'lit/directives/unsafe-html.js';
import { convertButtons, convertHeadings, convertLinks } from './text.util';

/**
 * Converts text to HTML and applies the following transformations:
 * - Headings (e.g. h1, h2, small, caption, strong)
 * - Links
 * - Buttons
 * ```
 */
export declare class TextMixinInterface {
  protected convertText(
    raw: string
  ): DirectiveResult<typeof UnsafeHTMLDirective>;
}

export const TextMixinInternals = Symbol('LayoutMixinInternals');

export const TextMixin = <T extends Type<LitElement>>(
  superClass: T
): Type<TextMixinInterface> & T => {
  @ssrShim('style')
  @hydrate()
  @signalAware()
  class TextMixinClass extends superClass {
    protected convertText(
      raw: string
    ): DirectiveResult<typeof UnsafeHTMLDirective> | void {
      if (!raw || typeof raw !== 'string') return;
      let text = this[TextMixinInternals].convertHeadings(raw);
      text = this[TextMixinInternals].convertLinks(text);
      text = this[TextMixinInternals].convertButtons(text);
      return unsafeHTML(text);
    }

    // Do not leak methods into public API as they can conflict with other mixins
    protected [TextMixinInternals] = {
      convertLinks,
      convertButtons,
      convertHeadings,
    };
  }
  return TextMixinClass as unknown as Type<TextMixinInterface> & T;
};
