import { TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';
import { SearchBoxOptions } from '../index';

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

  renderControls(options: SearchBoxOptions): TemplateResult {
    return html`
      <oryx-button slot="suffix" type="text">
        <button
          @click=${(e: Event): void => this.dispatchEvent(e, 'oryx.clear')}
          @mousedown=${this.muteMousedown}
        >
          ${options.clearButtonTitle || 'Clear'}
        </button>
      </oryx-button>

      <oryx-icon-button slot="suffix" size="small">
        <button
          aria-label=${options.closeButtonArialLabel || 'Close results'}
          @click=${(e: Event): void => this.dispatchEvent(e, 'oryx.close')}
          @mousedown=${this.muteMousedown}
        >
          <oryx-icon type="close"></oryx-icon>
        </button>
      </oryx-icon-button>
    `;
  }
}
