import { Icons } from '@spryker-oryx/ui/icon';
import { Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { ColorType, LinkComponentAttributes, LinkType } from './link.model';
import { linkStyles } from './styles';

export class LinkComponent
  extends LitElement
  implements LinkComponentAttributes
{
  static styles = linkStyles;

  @property({ reflect: true }) color?: ColorType = ColorType.Neutral;
  @property({ reflect: true, attribute: 'link-type' }) linkType?: LinkType;
  @property({ type: Boolean, reflect: true }) disabled?: boolean;
  @property({ reflect: true }) icon?: Icons | string;
  @property({ reflect: true }) singleLine?: boolean;

  protected render(): TemplateResult {
    return html`
      <slot name="icon">
        ${when(
          this.icon,
          () =>
            html`<oryx-icon .type=${this.icon} .size=${Size.Md}></oryx-icon>`
        )}
      </slot>
      <slot></slot>
    `;
  }
}
