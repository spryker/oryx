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
import { LitElement, TemplateResult, html } from 'lit';
import { catchError, of, switchMap } from 'rxjs';
import { DataWrapperComponentOptions } from './data-wrapper.model';

@hydrate()
export class DataWrapperComponent extends ContentMixin<DataWrapperComponentOptions>(
  LitElement
) {
  protected entityService = resolve(EntityService);
  protected contextService = resolve(ContextService);
  protected linkService = resolve(LinkService);

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
      ? html`<oryx-link>
          <a href=${this.$link()}><slot></slot></a>
        </oryx-link>`
      : html`<slot></slot>`;
  }
}
