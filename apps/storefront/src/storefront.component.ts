import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('storefront-component')
export class StorefrontComponent extends LitElement {
  @property({ type: String })
  protected route? = '/';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  override render(): TemplateResult {
    return html`<div>
      <experience-composition key="${this.route}"></experience-composition>
      <product-title code="121"></product-title>
    </div> `;
  }
}
