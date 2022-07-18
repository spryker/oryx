import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { Icons } from '../../../graphical/icon';
import { LinkTypes } from './link.model';
import { linkStyles } from './link.styles';

export class LinkComponent extends LitElement {
  static styles = linkStyles;

  @property({ reflect: true }) linkType?: LinkTypes;
  @property({ type: Boolean, reflect: true }) disabled?: boolean;
  @property({ reflect: true }) icon?: Icons | string;

  protected render(): TemplateResult {
    return html`
      <slot name="icon">
        ${when(
          this.icon,
          () => html`<oryx-icon .type=${this.icon}></oryx-icon>`
        )}
      </slot>
      <slot></slot>
    `;
  }
}
