import { resolve } from '@spryker-oryx/di';
import {
  CompositionLayout,
  ContentMixin,
  LayoutService,
  StyleRuleSet,
} from '@spryker-oryx/experience';
import {
  LayoutAttributes,
  ScreenLayout,
} from '@spryker-oryx/experience/layout';
import {
  computed,
  ConnectableSignal,
  signalAware,
  signalProperty,
  ssrShim,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';

import { Type } from '@spryker-oryx/di';
import { map } from 'rxjs';
import { LayoutController } from '../controllers/layout.controller';

export declare class LayoutMixinInterface {
  layout?: CompositionLayout;
  bleed?: boolean;
  sticky?: boolean;
  xs?: ScreenLayout;
  sm?: ScreenLayout;
  md?: ScreenLayout;
  lg?: ScreenLayout;
  xl?: ScreenLayout;
  protected layoutStyles: ConnectableSignal<string | undefined>;
}

export const LayoutMixin = <T extends Type<LitElement & LayoutAttributes>>(
  superClass: T
): Type<LayoutMixinInterface> & T => {
  @signalAware()
  @ssrShim('style')
  class LayoutMixinClass extends ContentMixin(superClass) {
    @signalProperty() layout?: CompositionLayout;
    @signalProperty({ type: Boolean }) bleed?: boolean;
    @signalProperty({ type: Boolean }) sticky?: boolean;

    @signalProperty({ type: Object }) xs?: ScreenLayout;
    @signalProperty({ type: Object }) sm?: ScreenLayout;
    @signalProperty({ type: Object }) md?: ScreenLayout;
    @signalProperty({ type: Object }) lg?: ScreenLayout;
    @signalProperty({ type: Object }) xl?: ScreenLayout;

    @signalProperty() layoutXs?: CompositionLayout;
    @signalProperty() layoutSm?: CompositionLayout;
    @signalProperty() layoutMd?: CompositionLayout;
    @signalProperty() layoutLg?: CompositionLayout;
    @signalProperty() layoutXl?: CompositionLayout;

    @signalProperty({ type: Boolean }) bleedXs?: boolean;
    @signalProperty({ type: Boolean }) bleedSm?: boolean;
    @signalProperty({ type: Boolean }) bleedMd?: boolean;
    @signalProperty({ type: Boolean }) bleedLg?: boolean;
    @signalProperty({ type: Boolean }) bleedXl?: boolean;

    @signalProperty({ type: Boolean }) stickyXs?: boolean;
    @signalProperty({ type: Boolean }) stickySm?: boolean;
    @signalProperty({ type: Boolean }) stickyMd?: boolean;
    @signalProperty({ type: Boolean }) stickyLg?: boolean;
    @signalProperty({ type: Boolean }) stickyXl?: boolean;

    protected layoutController = new LayoutController(this);
    protected layoutService = resolve(LayoutService);

    protected layoutStyles = computed(() => {
      const rules = (this.$options() as { rules: StyleRuleSet[] }).rules;
      const componentStyles = this.layoutController.collectStyles(
        rules,
        this.uid
      );
      const graph = this.layoutController.getLayoutInfos(
        ['layout', 'sticky', 'bleed'],
        rules
      );

      return this.layoutService
        .getStyles(graph)
        .pipe(map((layoutStyles) => `${layoutStyles}\n${componentStyles}`));
    });
  }

  // Cast return type to your mixin's interface intersected with the superClass type
  return LayoutMixinClass as unknown as Type<LayoutMixinInterface> & T;
};
