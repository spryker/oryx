import { ContentMixin } from '@spryker-oryx/experience';
import { ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { sitePriceModeSelectorStyles } from './price-mode-selector.styles';

@hydrate({ event: ['mouseover', 'focusin'] })
export class SitePriceModeSelectorComponent extends ContentMixin(LitElement) {
  static styles = [sitePriceModeSelectorStyles];

  protected $current = 'Gross';

  protected override render(): TemplateResult | void {
    return html` <oryx-dropdown vertical-align position="start">
      <oryx-button
        slot="trigger"
        .size=${ButtonSize.Md}
        .type=${ButtonType.None}
      >
        ${this.$current}
        <oryx-icon .type=${IconTypes.Dropdown}></oryx-icon>
      </oryx-button>
      <oryx-option close-popover> Gross </oryx-option>

      <oryx-option close-popover> Net </oryx-option>
    </oryx-dropdown>`;
  }
}
