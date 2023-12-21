import { EntityService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ContentAsset, ContentMixin } from '@spryker-oryx/experience';
import { computed, hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';
import { catchError, of } from 'rxjs';
import { EntityImageOptions } from './entity-image.model';

@hydrate()
export class EntityImageComponent extends ContentMixin<EntityImageOptions>(
  LitElement
) {
  protected entityService = resolve(EntityService);

  protected $data = computed<string | ContentAsset | undefined>(() => {
    const { entity: type, field } = this.$options();
    return this.entityService
      .getField<string>({ element: this, type, field })
      .pipe(catchError(() => of()));
  });

  protected override render(): TemplateResult | void {
    const image = this.$data();

    if (!image && !this.$options().renderFallback) return;

    return html`<oryx-image
      .src=${(image as ContentAsset)?.src ?? image}
      .alt=${(image as ContentAsset)?.alt}
    ></oryx-image>`;
  }
}
