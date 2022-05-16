import { ContextService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue, observe } from '@spryker-oryx/lit-rxjs';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  map,
  of,
  switchMap,
} from 'rxjs';
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
  protected context = resolve(this, ContextService, null);

  protected productCode$ = combineLatest([
    this.context?.get<string>(this, ProductContext.Code) ?? of(''),
    this.code$,
  ]).pipe(map(([code, propCode]) => propCode ?? code));

  protected productTitle$ = this.productCode$.pipe(
    switchMap((code) =>
      code
        ? this.productService
            .get({ sku: code })
            .pipe(catchError(() => of(null)))
        : of(null)
    ),
    map((product) => product?.name ?? '')
  );

  override render(): TemplateResult {
    return html`${asyncValue(this.productTitle$, (title) => {
      return html`<h1>${title}</h1>`;
    })}`;
  }
}
