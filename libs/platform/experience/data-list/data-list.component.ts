import {
  ContextController,
  EntityContext,
  EntityService,
} from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, LayoutMixin } from '@spryker-oryx/experience';

import {
  computed,
  elementEffect,
  hydrate,
  signalAware,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { of } from 'rxjs';
import { DataListOptions } from './data-list.model';
import { dataListStyles } from './data-list.styles';

@hydrate()
@signalAware()
export class DataListComponent extends LayoutMixin(
  ContentMixin<DataListOptions>(LitElement)
) {
  static styles = dataListStyles;

  protected contextController: ContextController = new ContextController(this);

  @elementEffect()
  protected setContext = (): void => {
    this.contextController.provide(EntityContext, this.$options().entity);
  };

  protected entityService = resolve(EntityService);

  protected $list = computed(() =>
    this.$options().entity
      ? this.entityService.getList({ type: this.$options().entity })
      : of([])
  );

  protected override render(): TemplateResult | void {
    const list = this.$list();

    if (!list?.length) return;

    return this.renderLayout({
      template: html`${repeat(
        list,
        (item) =>
          html`<oryx-link
            ><a href="/merchant/MER000001">
              <oryx-composition
                .uid=${this.uid}
                data-merchant=${item.id}
              ></oryx-composition> </a
          ></oryx-link>`
      )}`,
    });
  }
}
