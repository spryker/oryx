import { ContextController, EntityContext } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, LayoutMixin } from '@spryker-oryx/experience';

import {
  elementEffect,
  hydrate,
  signal,
  signalAware,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { DataListOptions } from './data-list.model';

@hydrate()
@signalAware()
export class DataListComponent extends LayoutMixin(
  ContentMixin<DataListOptions>(LitElement)
) {
  protected contextController: ContextController = new ContextController(this);

  @elementEffect()
  protected setContext = (): void => {
    this.contextController.provide(EntityContext, this.$options().entity);
  };

  // TODO: abstract away the service and context (data-merchant) based on entity
  protected merchantService = resolve('oryx.MerchantService');
  protected $list = signal(this.merchantService.getList());

  protected override render(): TemplateResult | void {
    const list = this.$list();

    if (!list?.length) return;

    return this.renderLayout({
      template: html`${repeat(
        list,
        (item) =>
          html`<oryx-composition
            .uid=${this.uid}
            data-merchant=${item.id}
          ></oryx-composition>`
      )}`,
    });
  }
}
