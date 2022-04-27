import { CoreServices } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue, observe } from '@spryker-oryx/lit-rxjs';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import {
  BehaviorSubject,
  combineLatest,
  defaultIfEmpty,
  of,
  pluck,
  switchMap,
} from 'rxjs';
import { ProductContext, ProductDomain } from '../../src';
import { styles } from './title.styles';

export class TitleComponent extends LitElement {
  static styles = styles;

  @property()
  protected uid?: string;

  @property()
  protected code?: string;

  @observe()
  protected code$ = new BehaviorSubject(this.code);

  protected productService = resolve(this, ProductDomain.ProductService);
  protected context = resolve(this, CoreServices.Context, null);

  protected productTitle$ = combineLatest([
    this.context
      ?.get<string>(this, ProductContext.Code)
      .pipe(defaultIfEmpty('')) ?? of(''),
    this.code$,
  ]).pipe(
    switchMap(([code, propCode]) =>
      this.productService.get({ sku: propCode ?? code })
    ),
    pluck('name')
  );

  override render(): TemplateResult {
    return html`${asyncValue(this.productTitle$, (title) => {
      return html`<h1>${title}</h1>`;
    })}`;
  }
}
