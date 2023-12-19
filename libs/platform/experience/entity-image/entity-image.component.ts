import { EntityService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { computed, hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';
import { of } from 'rxjs';
import { EntityImageOptions } from './entity-image.model';

@hydrate()
export class EntityImageComponent extends ContentMixin<EntityImageOptions>(
  LitElement
) {
  protected entityService = resolve(EntityService);

  protected $data = computed<string | undefined>(() => {
    const { entity: type, field } = this.$options();
    if (!type || !field) return of();
    return this.entityService.getField({ element: this, type, field });
  });

  protected override render(): TemplateResult | void {
    const imageUrl = this.$data();

    if (!imageUrl && !this.$options().renderFallback) return;

    return html`<oryx-image .src=${imageUrl}></oryx-image>`;
  }
}
