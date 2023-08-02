import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { CardType } from './card.model';
import { styles } from './card.styles';

export class CardComponent extends LitElement {
  static styles = styles;

  @property({ reflect: true }) type?: CardType;

  @property() heading?: string;

  protected override render(): TemplateResult {
    return html`
      <slot name="heading">
        <oryx-heading>
          <h5>${this.heading}</h5>
        </oryx-heading>
      </slot>
      <slot name="footer"></slot>
      <slot part="body"></slot>
    `;
  }
}
