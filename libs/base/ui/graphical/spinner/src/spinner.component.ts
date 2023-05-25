import { Icons, IconTypes } from '@spryker-oryx/ui/icon';
import { Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { SpinnerProperties, SpinnerRotation } from './spinner.model';
import { styles } from './spinner.styles';

export class SpinnerComponent extends LitElement implements SpinnerProperties {
  static styles = [styles];

  @property() icon: Icons | string = IconTypes.Loader;
  @property() size = Size.Md;
  @property({ reflect: true }) rotation = SpinnerRotation.ClockWise;

  protected override render(): TemplateResult {
    return html`
      <slot>
        <oryx-icon .type=${this.icon} size="${this.size}"></oryx-icon>
      </slot>
    `;
  }
}
