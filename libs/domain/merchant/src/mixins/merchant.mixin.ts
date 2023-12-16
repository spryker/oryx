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
import { Merchant, MerchantQualifier } from '../models';
import { MerchantContext, MerchantService } from '../services';

export declare class MerchantMixinInterface {
  protected contextController: ContextController;

  merchant?: string;
  protected $merchant: Signal<Merchant | null>;
  protected $merchantMinimal: Signal<Merchant | null>;
}

export const MerchantMixinInternals = Symbol('MerchantMixinInternals');

export const MerchantMixin = <T extends Type<LitElement>>(
  superClass: T
): Type<MerchantMixinInterface> & T => {
  @signalAware()
  class MerchantMixinClass extends superClass {
    @signalProperty({ reflect: true }) merchant?: string;

    protected [MerchantMixinInternals] = {
      merchantService: resolve(MerchantService),
      contextService: resolve(ContextService),
    };

    protected $merchantContext = signal(
      this[MerchantMixinInternals].contextService.get<MerchantQualifier>(
        this,
        MerchantContext.ID
      )
    );

    protected $merchant = computed(() => {
      const qualifier = (this.merchant as string) ?? this.$merchantContext();
      return qualifier
        ? this[MerchantMixinInternals].merchantService?.get({
            id: qualifier,
          })
        : undefined;
    });

    // protected $merchantMinimal = computed(() => {
    //   const qualifier = this.$merchantContext();
    //   return qualifier
    //     ? this[MerchantMixinInternals].merchantService?.get({
    //         ...qualifier,
    //         scope: 'minimal',
    //       })
    //     : undefined;
    // });
  }
  return MerchantMixinClass as unknown as Type<MerchantMixinInterface> & T;
};
