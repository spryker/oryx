import { hydrate, Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { IconButtonProperties } from './icon-button.model';
import { iconButtonStyles } from './icon-button.styles';

@hydrate()
export class IconButtonComponent
  extends LitElement
  implements IconButtonProperties
{
  static styles = [iconButtonStyles];

  @property({ reflect: true }) size = Size.Md;

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
