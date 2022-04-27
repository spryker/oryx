import { CoreServices } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue, observe } from '@spryker-oryx/lit-rxjs';
import { ProductContext } from '@spryker-oryx/product';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BehaviorSubject, tap } from 'rxjs';

@customElement('storefront-component')
export class StorefrontComponent extends LitElement {
  protected context = resolve(this, CoreServices.Context);

  @property({ type: String })
  protected route? = '/';

  @observe()
  protected route$ = new BehaviorSubject(this.route).pipe(
    tap((route) => {
      // TODO: fix hardcoded code
      this.context.provide(this, ProductContext.Code, '119');
    })
  );

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  override render(): TemplateResult {
    return html`<div>
      <experience-composition
        key="${asyncValue(this.route$)}"
      ></experience-composition>
      <product-title></product-title>
    </div> `;
  }
}
