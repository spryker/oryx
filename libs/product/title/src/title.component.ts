import { CoreServices } from '@spryker-oryx/core';
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
import { ProductService } from '../../src/services/product.service';
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

  protected productService = resolve(this, ProductService);
  protected context = resolve(this, CoreServices.Context, null);

  protected productCode$ = combineLatest([
    // TODO: This should be simplified with proper context utility
    /*
    this.context?.get<string>(this, ProductContext.Code).pipe(
      // TODO: Remove when context won't be emitting EMPTY
      defaultIfEmpty('')
    ) ?? of(''),
    */
    this.code$,
  ]).pipe(map(([code]) => code));

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
