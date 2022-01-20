import { html, LitElement, ReactiveController, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';

export class AffixController implements ReactiveController {
  constructor(protected host: LitElement) {
    this.host.addController(this);
  }

  hostConnected?(): void;

  render(slotName: string, icon?: string): TemplateResult {
    return html`
      ${when(
        this.hasContent(slotName, icon),
        () => html` <slot name=${slotName}>
          <oryx-icon .type="${icon}"></oryx-icon>
        </slot>`
      )}
    `;
  }

  protected hasContent(slotName: string, icon?: string): boolean {
    return (
      !!icon || this.host.querySelectorAll(`*[slot=${slotName}]`).length > 0
    );
  }
}
