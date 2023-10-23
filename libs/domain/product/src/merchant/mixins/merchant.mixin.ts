import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import {
  computed,
  Signal,
  signal,
  signalAware,
  signalProperty,
  Type,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { MerchantContext } from '../merchant.context';
import { MerchantService } from '../merchant.service';
import { Merchant, MerchantComponentProperties } from '../models';

export declare class MerchantMixinInterface
  implements MerchantComponentProperties
{
  protected contextController: ContextController;

  merchant?: string;
  protected $merchant: Signal<Merchant | null>;
}

export const MerchantMixin = <
  T extends Type<LitElement & MerchantComponentProperties>
>(
  superClass: T
): Type<MerchantMixinInterface> & T => {
  @signalAware()
  class MerchantMixinClass extends superClass {
    @signalProperty({ reflect: true }) merchant?: string;

    protected merchantService = resolve(MerchantService, null);

    protected contextController = new ContextController(this);

    protected $merchantContext = signal(
      this.contextController.get<string>(MerchantContext.ID)
    );

    protected $merchant = computed(() =>
      this.$merchantContext()
        ? this.merchantService.get({
            id: this.merchant ?? this.$merchantContext(),
          })
        : undefined
    );
  }
  return MerchantMixinClass as unknown as Type<MerchantMixinInterface> & T;
};
