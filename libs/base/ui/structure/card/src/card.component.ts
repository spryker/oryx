import { featureVersion } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { HeadingTag } from '../../heading/src';
import { CardType } from './card.model';
import { styles } from './card.styles';

export class CardComponent extends LitElement {
  static styles = styles;

  @property({ reflect: true }) type?: CardType;

  @property() heading?: string;

  protected override render(): TemplateResult {
    return html`
      <slot name="heading"
        >${this.__renderHeading()} ${this.__renderHeading()}
      </slot>
      <slot part="body"></slot>
      <slot name="footer"></slot>
    `;
  }

  // temporary implementation for backwards compatibility
  private __renderHeading(): TemplateResult {
    if (featureVersion >= '1.4') {
      return html`<oryx-heading .tag=${HeadingTag.H5}
        >${this.heading}</oryx-heading
      >`;
    } else {
      return html`<oryx-heading><h5>${this.heading}</h5></oryx-heading>`;
    }
  }
}
