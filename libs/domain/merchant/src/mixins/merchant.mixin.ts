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
import { Merchant, MerchantComponentProperties } from '../models';
import { MerchantContext, MerchantService } from '../services';

export declare class MerchantMixinInterface
  implements MerchantComponentProperties
{
  protected contextController: ContextController;

  merchant?: string;
  protected $merchant: Signal<Merchant | null>;
  protected $merchantMinimal: Signal<Merchant | null>;
}

export const MerchantMixinInternals = Symbol('MerchantMixinInternals');

export const MerchantMixin = <
  T extends Type<LitElement & MerchantComponentProperties>
>(
  superClass: T
): Type<MerchantMixinInterface> & T => {
  @signalAware()
  class MerchantMixinClass extends superClass {
    @signalProperty({ reflect: true }) merchant?: string;

    protected [MerchantMixinInternals] = {
      merchantService: resolve(MerchantService, null),
      contextService: resolve(ContextService, null),
    };

    protected $merchantContext = signal(
      this[MerchantMixinInternals].contextService?.get(this, MerchantContext.ID)
    );

    protected $merchant = computed(() => {
      const id = (this.merchant as string) ?? this.$merchantContext();
      return id
        ? this[MerchantMixinInternals].merchantService?.get({
            id,
          })
        : undefined;
    });

    // protected $merchantMinimal = computed(() => {
    //   const id = (this.merchant as string) ?? this.$merchantContext();
    //   return id
    //     ? this[MerchantMixinInternals].merchantService?.get({
    //         id,
    //         scope: 'minimal',
    //       })
    //     : undefined;
    // });
  }
  return MerchantMixinClass as unknown as Type<MerchantMixinInterface> & T;
};
