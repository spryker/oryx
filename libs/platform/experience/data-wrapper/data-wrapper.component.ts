import { ContextService, EntityService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { LinkService } from '@spryker-oryx/router';
import {
  computed,
  elementEffect,
  hydrate,
  signalProperty,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';
import { catchError, of, switchMap } from 'rxjs';
import { DataWrapperComponentOptions } from './data-wrapper.model';

@hydrate()
export class DataWrapperComponent extends ContentMixin<DataWrapperComponentOptions>(
  LitElement
) {
  protected entityService = resolve(EntityService);
  protected linkService = resolve(LinkService);
  protected contextService = resolve(ContextService);

  @signalProperty()
  qualifier: unknown;

  @signalProperty()
  entity = '';

  protected $entity = computed<string | undefined>(() =>
    this.contextService.get(this, 'entity')
  );

  protected $context = computed(() => {
    const entity = this.$entity();
    if (!entity || !this.qualifier) return of(undefined);

    return this.contextService
      .serialize(entity, this.qualifier)
      .pipe(
        switchMap((context) => this.contextService.deserialize(entity, context))
      );
  });

  @elementEffect()
  protected setContext = (): void => {
    if (this.$context() && this.$entity()) {
      this.contextService.provide(this, this.$entity()!, this.$context());
    }
  };

  protected $linkQualifier = computed(() =>
    this.entityService
      .getQualifier({ element: this, type: this.$entity() })
      .pipe(catchError(() => of()))
  );

  protected $link = computed(() => {
    const qualifier = this.$linkQualifier();
    return qualifier ? this.linkService.get(qualifier) : undefined;
  });

  protected override render(): TemplateResult | void {
    const { link } = this.$options();
    return link
      ? html`<a href=${this.$link()}><slot></slot></a>`
      : html`<slot></slot>`;
  }
}
