import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { Size } from '../../../utilities/model';
import { IconButtonProperties } from './icon-button.model';
import { iconButtonStyles } from './icon-button.styles';

export class IconButtonComponent
  extends LitElement
  implements IconButtonProperties
{
  static styles = [iconButtonStyles];

  @property({ reflect: true }) size = Size.medium;

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
