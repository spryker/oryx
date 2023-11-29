import { Type, hydrate, signalAware, ssrShim } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { DirectiveResult } from 'lit/directive.js';
import { UnsafeHTMLDirective, unsafeHTML } from 'lit/directives/unsafe-html.js';

export declare class TextMixinInterface {
  protected convertText(
    raw: string
  ): DirectiveResult<typeof UnsafeHTMLDirective>;
}

const linkRegex = /<a(.*?)>(.*?)<\/a>/gis;
const buttonRegex = /<button(.*?)>(.*?)<\/button>/gis;
const headingRegex =
  /<(h[1-6]|small|caption|strong)(.*?)>(.*?)<\/(h[1-6]|small|caption|strong)>/gis;
const subtitleRegex =
  /<(span|div)\s+([^>]*)class="([^"]*\b(subtitle|h[1-6])\b[^"]*)"([^>]*)>(.*?)<\/(span|div)>/gis;

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
    ): DirectiveResult<typeof UnsafeHTMLDirective> {
      let text = this[TextMixinInternals].convertTypography(raw);
      text = this[TextMixinInternals].convertLinks(text);
      text = this[TextMixinInternals].convertButtons(text);
      return unsafeHTML(text);
    }

    // hide private mixin methods from public API
    protected [TextMixinInternals] = {
      convertLinks(text: string): string {
        return text.replace(linkRegex, (link) => {
          return `<oryx-link>${link}</oryx-link>`;
        });
      },
      convertButtons(text: string): string {
        return text.replace(buttonRegex, (button) => {
          return `<oryx-button>${button}</oryx-button>`;
        });
      },
      convertTypography(text: string): string {
        return text
          ?.replace(headingRegex, (_, tag, attributes, content) => {
            return `<oryx-heading tag="${tag}" ${attributes}>${content}</oryx-heading>`;
          })
          .replace(
            subtitleRegex,
            (_, el, attrBefore, cls, tag, attrAfter, content) => {
              const attributes =
                attrBefore || attrAfter
                  ? ` ${attrBefore ?? ''} ${attrAfter ?? ''}`
                  : '';
              const classNames = cls.replace(tag, '').trim().length
                ? `class="${cls.replace(tag, '')}"`
                : ``;

              return `<oryx-heading typography="${tag}" ${classNames} ${attributes}>${content}</oryx-heading>`;
            }
          );
      },
    };
  }
  return TextMixinClass as unknown as Type<TextMixinInterface> & T;
};
