import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { IconSize, IconType } from './icon.model';
import { styles } from './icon.styles';

export class IconComponent extends LitElement {
  static styles = styles;

  /**
   * Defaults to 'large'.
   *
   * The default can be controlled by a CSS property (`--oryx-icon-size-default`)
   */
  @property({ reflect: true }) size?: IconSize;

  @property({ reflect: true }) type?: IconType | string;

  render(): TemplateResult {
    return html`
      <slot>
        ${this.type
          ? html`<svg viewBox="0 0 24 24">
              <use href="assets/icons.svg#${this.type}" />
            </svg> `
          : html``}
      </slot>
    `;
  }
}
