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
  @property({ type: Boolean, reflect: true }) disabled?: boolean;
  @property({ reflect: true }) singleLine?: boolean;

  protected iconType?: Icons | string;

  @property() set icon(value: Icons | string) {
    this.iconType = value;
    this.toggleAttribute('has-icon', !!value);
  }

  protected render(): TemplateResult {
    return html`
      ${when(
        this.iconType,
        () =>
          html`<oryx-icon .type=${this.iconType} .size=${Size.Md}></oryx-icon>`
      )}
      <slot></slot>
    `;
  }
}
