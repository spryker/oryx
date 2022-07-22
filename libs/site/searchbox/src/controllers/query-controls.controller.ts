import { LitElement, ReactiveController, TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';
import { QueryControlTranslations, SiteSearchboxProperties } from '..';

interface HostProperties
  extends SiteSearchboxProperties,
    QueryControlTranslations,
    LitElement {}

export class QueryControlsController implements ReactiveController {
  hostConnected?(): void;

  constructor(protected host: HostProperties) {
    this.host.addController(this);
  }

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
    if (!this.host.query) {
      return html``;
    }

    return html`
      <oryx-button slot="suffix" type="text">
        <button
          @click=${(e: Event): void => this.dispatchEvent(e, 'oryx.clear')}
          @mousedown=${this.muteMousedown}
        >
          ${this.host.clearButtonTitle}
        </button>
      </oryx-button>

      <oryx-icon-button slot="suffix" size="small">
        <button
          aria-label=${this.host.closeButtonArialLabel}
          @click=${(e: Event): void => this.dispatchEvent(e, 'oryx.close')}
          @mousedown=${this.muteMousedown}
        >
          <oryx-icon type="close"></oryx-icon>
        </button>
      </oryx-icon-button>
    `;
  }
}
