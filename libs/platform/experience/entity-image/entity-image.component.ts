import { EntityService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { computed, hydrate, Signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';
import { EntityImageOptions } from './entity-image.model';

@hydrate()
export class EntityImageComponent extends ContentMixin<EntityImageOptions>(
  LitElement
) {
  protected entityService = resolve(EntityService);

  protected $entityField: Signal<string | undefined> = computed<
    string | undefined
  >(() => {
    return this.entityService.getField<string>({
      element: this,
      type: this.$options().entity,
      field: this.$options().field,
    });
  });

  protected override render(): TemplateResult | void {
    const imageUrl = this.$entityField();

    if (!imageUrl && !this.$options().renderFallback) return;

    return html`<oryx-image .src=${imageUrl}></oryx-image>`;
  }
}
