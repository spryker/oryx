import './composition.component';
import { LitElement, TemplateResult } from 'lit';
import { html } from 'lit';
import { property, customElement } from 'lit/decorators.js';

@customElement('storefront-component')
export class StorefrontComponent extends LitElement {
  @property({ type: String })
  protected route? = '/';

  override render(): TemplateResult {
    return html`<div>
      <composition-component key="${this.route}"></composition-component>
    </div> `;
  }
}
