import { PickingListMixin } from '@spryker-oryx/picking';
import { I18nMixin, computed } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';

export class PickingOrderReferenceComponent extends I18nMixin(
  PickingListMixin(LitElement)
) {
  protected $ref = computed(() => this.$pickingList()?.orderReferences?.[0]);

  protected override render(): string | undefined {
    return this.$ref();
  }
}
