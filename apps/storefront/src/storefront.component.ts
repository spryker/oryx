import { ContextController } from '@spryker-oryx/core';
import { asyncValue, observe } from '@spryker-oryx/lit-rxjs';
import { ProductContext } from '@spryker-oryx/product';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BehaviorSubject, tap } from 'rxjs';
import { styles } from './storefront.styles';

@customElement('storefront-component')
export class StorefrontComponent extends LitElement {
  protected context = new ContextController(this);

  static styles = styles;

  @property({ type: String })
  protected route? = '/';

  @observe()
  protected route$ = new BehaviorSubject(this.route).pipe(
    tap((route) => {
      // TODO: fix hardcoded code
      this.context.provide(ProductContext.Code, '119');
    })
  );

  constructor() {
    super();
    this.route$.subscribe();
  }

  override render(): TemplateResult {
    return html`
      <experience-composition
        key="${asyncValue(this.route$)}"
      ></experience-composition>
      <div class="product-preview-wrapper">
        <product-image code="121"></product-image>
        <product-title code="121"></product-title>
      </div>
    `;
  }
}
