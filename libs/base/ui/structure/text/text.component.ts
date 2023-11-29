import { computed, featureVersion } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { TextMixin } from './text.mixin';
import { TextProperties } from './text.model';
import { textStyles } from './text.styles';

export class TextComponent
  extends TextMixin(LitElement)
  implements TextProperties
{
  static styles = featureVersion >= '1.4' ? undefined : textStyles;

  @property() content?: string;

  protected override render(): TemplateResult | void {
    if (!this.content) return;
    if (featureVersion >= '1.4') {
      return html`${this.$text()}`;
    }
    return html`${unsafeHTML(this.content)}`;
  }

  protected $text = computed(() => {
    const text = this.content;
    if (!text) return;
    return this.convertText(text);
  });
}
