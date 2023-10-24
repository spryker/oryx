import { ContextController, ContextService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import {
  Signal,
  Type,
  computed,
  signal,
  signalAware,
  signalProperty,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { MerchantContext } from '../merchant.context';
import { Merchant, MerchantComponentProperties } from '../merchant.model';
import { MerchantService } from '../merchant.service';

export declare class MerchantMixinInterface
  implements MerchantComponentProperties
{
  protected contextController: ContextController;

  merchant?: string;
  protected $merchant: Signal<Merchant | null>;
}

const MixinInternals = Symbol('MerchantMixinInternals');

export const MerchantMixin = <
  T extends Type<LitElement & MerchantComponentProperties>
>(
  superClass: T
): Type<MerchantMixinInterface> & T => {
  @signalAware()
  class MerchantMixinClass extends superClass {
    @signalProperty({ reflect: true }) merchant?: string;

    protected [MixinInternals] = {
      merchantService: resolve(MerchantService, null),
      contextService: resolve(ContextService, null),
    };

    protected $merchantContext = signal(
      this[MixinInternals].contextService?.get(this, MerchantContext.ID)
    );

    protected $merchant = computed(() => {
      const id = this.merchant ?? this.$merchantContext();
      return id
        ? this[MixinInternals].merchantService?.get({
            id,
          })
        : undefined;
    });
  }
  return MerchantMixinClass as unknown as Type<MerchantMixinInterface> & T;
};
