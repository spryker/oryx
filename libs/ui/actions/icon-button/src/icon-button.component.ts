import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { Size } from '../../../utilities/model';
import { iconButtonStyles } from './icon-button.styles';

export class IconButtonComponent extends LitElement {
  static styles = [iconButtonStyles];

  @property({ reflect: true }) size?: Size;

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
