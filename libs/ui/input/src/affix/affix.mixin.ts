import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { Constructor } from '../../../utilities/model';
import { AffixController } from './affix.controller';
import { AffixInterface } from './affix.model';

export const AffixMixin = <T extends Constructor<LitElement>>(
  superClass: T
): Constructor<AffixInterface> & T => {
  class AffixClass extends superClass {
    affixController = new AffixController(this);

    @property() prefixIcon?: string;
    @property() suffixIcon?: string;
  }

  return AffixClass as unknown as Constructor<AffixInterface> & T;
};
