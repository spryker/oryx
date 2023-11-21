import { resolve } from '@spryker-oryx/di';
import { PickingListService } from '@spryker-oryx/picking/services';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { I18nMixin } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { pickingSearchComponentStyles } from './search.styles';

export class PickingSearchComponent extends I18nMixin(LitElement) {
  static styles = pickingSearchComponentStyles;

  protected pickingListService = resolve(PickingListService);

  protected onSearch(e: KeyboardEvent): void {
    const value = (e.target as HTMLInputElement).value;

    if (value.length < 2) return;

    this.pickingListService.setQualifier({
      searchOrderReference: value,
    });
  }

  protected onToggleSearch(isSearch: boolean): void {
    this.pickingListService.setQualifier({
      searchOrderReference: '',
    });
    this.pickingListService.toggleActiveSearch(isSearch);
  }

  protected override render(): TemplateResult {
    return html`
      <oryx-search
        backIcon=${IconTypes.Backward}
        float
        @oryx.open=${(): void => this.onToggleSearch(true)}
        @oryx.close=${(): void => this.onToggleSearch(false)}
      >
        <input
          placeholder=${this.i18n('picking.header.order-ID')}
          @input=${this.onSearch}
        />
      </oryx-search>
    `;
  }
}
