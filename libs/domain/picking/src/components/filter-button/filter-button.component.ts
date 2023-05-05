import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { tap } from 'rxjs';
import { Size } from '@spryker-oryx/utilities';
import { styles } from './filter-button.styles';
import { state } from 'lit/decorators.js';

export class FilterButtonComponent extends LitElement {
  static styles = styles;

  @state()
  protected showFilters = false;

  protected onClick(e: Event): void {
    e.preventDefault();

    this.showFilters = true;
  }

  protected onReset(): void {
    console.log('reset');
    
    this.showFilters = false;
  }

  protected onClose(): void {
    console.log('close');
    
    this.showFilters = false;
  }

  protected override render(): TemplateResult {
    return html`
      <oryx-toggle-icon size=${Size.Md}>
        <input 
          type="checkbox"
          placeholder="toggle filters"
          @click=${(e: Event) => this.onClick(e)}
        >
        <oryx-icon type="filter"></oryx-icon>
        <span>${i18n('picking.filter.sort')}</span>
      </oryx-toggle-icon>
      
      ${this.renderModal()}  
    `;
  }

  protected renderModal(): TemplateResult {
    return html`<oryx-modal
      ?open=${this.showFilters}
      enableCloseButtonInHeader
      enableNavigateBack
      fullscreen
      @oryx.back=${this.onReset}
      @oryx.close=${this.onClose}
    >
      <oryx-heading slot="heading">
        <h4>${i18n('picking.filter.filter-&-Sort')}</h4>
      </oryx-heading>

      <oryx-link slot="navigate-back">
        <a href="#">${i18n('picking.filter.reset')}</a>
      </oryx-link>

      content
    </oryx-modal>`
  }
}
