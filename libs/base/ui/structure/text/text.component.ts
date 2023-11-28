import { computed, featureVersion } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { TextMixin } from './text.mixin';
import { TextProperties } from './text.model';
import { textStyles } from './text.styles';

export class TextComponent
  extends TextMixin(LitElement)
  implements TextProperties
{
  static styles = featureVersion >= '1.4' ? css`` : textStyles;

  @property() content?: string;

  protected $text = computed(() => {
    const text = this.content;
    if (!text) return;
    return this.convertText(text);
  });

  protected override render(): TemplateResult | void {
    return html`${this.$text()}`;
  }
}
