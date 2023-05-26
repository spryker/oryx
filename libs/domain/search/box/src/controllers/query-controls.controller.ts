import { IconTypes } from '@spryker-oryx/ui/icon';
import { i18n, Size } from '@spryker-oryx/utilities';
import { TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';

export class QueryControlsController {
  protected dispatchEvent(e: Event, eventType: string): void {
    e.target?.dispatchEvent(
      new CustomEvent(eventType, { bubbles: true, composed: true })
    );
  }

  // The oryx-typeahead is using focusin and mousedown events listening inside for
  // managing its opened state.
  // Need to mute this behavior for control buttons to avoid unexpected closing/opening
  // of dropdown with results
  protected muteMousedown(e: Event): void {
    e.stopPropagation();
    e.preventDefault();
  }

  renderControls(): TemplateResult {
    return html`
      <oryx-button slot="suffix" type="text">
        <button
          type="button"
          @click=${(e: Event): void => this.dispatchEvent(e, 'oryx.clear')}
          @mousedown=${this.muteMousedown}
        >
          ${i18n('search.box.clear')}
        </button>
      </oryx-button>

      <oryx-icon-button slot="suffix" size=${Size.Sm}>
        <button
          aria-label="Close results"
          type="button"
          @click=${(e: Event): void => this.dispatchEvent(e, 'oryx.close')}
          @mousedown=${this.muteMousedown}
        >
          <oryx-icon .type=${IconTypes.Close}></oryx-icon>
        </button>
      </oryx-icon-button>
    `;
  }
}
