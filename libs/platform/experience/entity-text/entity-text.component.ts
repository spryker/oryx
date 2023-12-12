import { EntityService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { computed, hydrate, signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';
import { FieldTextOptions } from './entity-text.model';

@hydrate()
export class EntityTextComponent extends ContentMixin<FieldTextOptions>(
  LitElement
) {
  protected entity = resolve(EntityService);

  $entityField = computed( () =>
    this.entity.getField({
      element: this,
      type: this.$options().entity,
      field: this.$options().field,
    })
  );

  protected override render(): TemplateResult | void {
    return html`${this.$entityField()}`;
  }
}
