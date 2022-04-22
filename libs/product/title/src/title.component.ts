import { resolve } from '@spryker-oryx/injector';
import { asyncValue, observe } from '@spryker-oryx/lit-rxjs';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { BehaviorSubject, pluck, switchMap } from 'rxjs';
import { ProductDomain } from '../../src';
import { styles } from './title.styles';

export class TitleComponent extends LitElement {
  static styles = styles;

  @property()
  protected uid?: string;

  // TODO: Remove default code fallback once product service will be created
  @property()
  protected code = '119';

  @observe()
  protected code$ = new BehaviorSubject(this.code);

  protected productService = resolve(this, ProductDomain.ProductService);

  protected productTitle$ = this.code$.pipe(
    switchMap((code) => this.productService.get({ sku: code })),
    pluck('name')
  );

  override render(): TemplateResult {
    return html`${asyncValue(this.productTitle$, (title) => {
      return html`<h1>${title}</h1>`;
    })}`;
  }
}
