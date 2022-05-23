import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue, observe } from '@spryker-oryx/lit-rxjs';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { BehaviorSubject, map, switchMap } from 'rxjs';
import { ProductContext, ProductService } from '../../src';
import { styles } from './title.styles';

export class TitleComponent extends LitElement {
  static styles = styles;

  @property()
  protected uid?: string;

  @property()
  protected code?: string;

  @observe()
  protected code$ = new BehaviorSubject(this.code);

  protected productService = resolve(this, ProductService);
  protected context = new ContextController(this);

  protected productTitle$ = this.context
    .get(ProductContext.Code, this.code$)
    .pipe(
      switchMap((code) => this.productService.get({ sku: code })),
      map((product) => product?.name ?? '')
    );

  override render(): TemplateResult {
    return html`${asyncValue(this.productTitle$, (title) => {
      return html`<h1>${title}</h1>`;
    })}`;
  }
}
