import { Type } from '@spryker-oryx/di';
import {
  CompositionLayout,
  ContentMixin,
  layoutKeys,
  StyleRuleSet,
} from '@spryker-oryx/experience';
import {
  LayoutAttributes,
  LayoutProperties,
} from '@spryker-oryx/experience/layout';
import {
  computed,
  ConnectableSignal,
  signalAware,
  signalProperty,
  ssrShim,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { LayoutController } from '../controllers/layout.controller';

export declare class LayoutMixinInterface {
  layout?: CompositionLayout;
  bleed?: boolean;
  sticky?: boolean;
  overlap?: boolean;
  divider?: boolean;
  vertical?: boolean;
  xs?: LayoutProperties;
  sm?: LayoutProperties;
  md?: LayoutProperties;
  lg?: LayoutProperties;
  xl?: LayoutProperties;
  protected layoutStyles: ConnectableSignal<string | undefined>;
}

interface LayoutContentOptions {
  rules: StyleRuleSet[];
}

export const LayoutMixin = <T extends Type<LitElement & LayoutAttributes>>(
  superClass: T
): Type<LayoutMixinInterface> & T => {
  @signalAware()
  @ssrShim('style')
  class LayoutMixinClass extends ContentMixin<LayoutContentOptions>(
    superClass
  ) {
    @signalProperty() layout?: CompositionLayout;
    @signalProperty({ type: Boolean }) bleed?: boolean;
    @signalProperty({ type: Boolean }) sticky?: boolean;
    @signalProperty({ type: Boolean }) overlap?: boolean;
    @signalProperty({ type: Boolean }) divider?: boolean;
    @property({ type: Boolean, reflect: true }) vertical?: boolean;

    @signalProperty({ type: Object, reflect: true }) xs?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true }) sm?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true }) md?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true }) lg?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true }) xl?: LayoutProperties;

    protected layoutController = new LayoutController(this);

    protected layoutStyles = computed(() =>
      this.layoutController.getStyles(
        ['layout', ...layoutKeys],
        this.$options().rules
      )
    );
  }

  // Cast return type to your mixin's interface intersected with the superClass type
  return LayoutMixinClass as unknown as Type<LayoutMixinInterface> & T;
};
