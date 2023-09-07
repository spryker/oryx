import { Icons } from '@spryker-oryx/ui/icon';
import { Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { ColorType, LinkComponentAttributes, LinkType } from './link.model';

export class LinkComponent
  extends LitElement
  implements LinkComponentAttributes
{
  @property({ reflect: true }) color?: ColorType = ColorType.Neutral;
  @property({ reflect: true, attribute: 'link-type' }) linkType?: LinkType;
  @property({ reflect: true }) icon?: Icons | string;
  @property({ type: Boolean, reflect: true }) disabled?: boolean;
  @property({ type: Boolean, reflect: true }) singleLine?: boolean;
  @property({ reflect: true }) size?: Size;

  protected render(): TemplateResult {
    return html`
      ${when(
        this.icon,
        () =>
          html`<oryx-icon .type=${this.icon} .size=${this.size}></oryx-icon>`
      )}
      <slot></slot>
    `;
  }
}
