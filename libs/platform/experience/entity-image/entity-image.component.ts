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

  protected $data: Signal<string | undefined> = computed<string | undefined>(
    () => {
      const { entity: type, field } = this.$options();
      return this.entityService.getField({ element: this, type, field });
    }
  );

  protected override render(): TemplateResult | void {
    const imageUrl = this.$data();

    if (!imageUrl && !this.$options().renderFallback) return;

    return html`<oryx-image .src=${imageUrl}></oryx-image>`;
  }
}
