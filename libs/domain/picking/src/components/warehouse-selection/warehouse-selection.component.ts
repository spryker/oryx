import { i18n, Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { styles } from './warehouse-selection.styles';

export class WarehouseSelectionComponent extends LitElement {
  static styles = styles;

  locations = [
    {
      uuid: '1',
      name: 'Location 1',
    },
    {
      uuid: '2',
      name: 'Location 2',
    },
    {
      uuid: '3',
      name: 'Location 3',
    },
  ];

  protected override render(): TemplateResult {
    return html`
      <oryx-heading as="h4">
        <h1>${i18n('picking.select-your-location-to-get-started')}</h1>
      </oryx-heading>
      ${repeat(
        this.locations,
        (item) => item.uuid,
        (item) => html`
          <oryx-heading>
            <h3>${item.name}</h3>
          </oryx-heading>

          <oryx-button size=${Size.Sm}>
            <button>${i18n('picking.select')}</button>
          </oryx-button>
          <hr />
        `
      )}
    `;
  }
}
