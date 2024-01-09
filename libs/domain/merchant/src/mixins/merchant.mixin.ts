import { ContextController, ContextService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import {
  Signal,
  Type,
  computed,
  signal,
  signalAware,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { MERCHANT } from '../entity';
import { Merchant, MerchantQualifier } from '../models';
import { MerchantService } from '../services';

export declare class MerchantMixinInterface {
  protected contextController: ContextController;

  protected $merchant: Signal<Merchant | null>;
  protected $merchantMinimal: Signal<Merchant | null>;
}

export const MerchantMixinInternals = Symbol('MerchantMixinInternals');

export const MerchantMixin = <T extends Type<LitElement>>(
  superClass: T
): Type<MerchantMixinInterface> & T => {
  @signalAware()
  class MerchantMixinClass extends superClass {
    protected [MerchantMixinInternals] = {
      merchantService: resolve(MerchantService),
      contextService: resolve(ContextService),
    };

    protected $merchantContext = signal(
      this[MerchantMixinInternals].contextService.get<MerchantQualifier>(
        this,
        MERCHANT
      )
    );

    protected $merchant = computed(() => {
      const qualifier = this.$merchantContext();
      return qualifier
        ? this[MerchantMixinInternals].merchantService?.get(qualifier)
        : undefined;
    });
  }
  return MerchantMixinClass as unknown as Type<MerchantMixinInterface> & T;
};
