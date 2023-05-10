import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
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

  protected onSubmit(e: CustomEvent): void {
    const { values } = e.detail;

    console.log(values);

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
      
      <oryx-picking-filters
        ?open=${this.showFilters}
        @oryx.back=${this.onReset}
        @oryx.close=${this.onClose}
        @oryx.submit=${this.onSubmit}
      ></oryx-picking-filters> 
    `;
  }
}
