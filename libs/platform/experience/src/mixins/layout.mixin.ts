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
  Type,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
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
    @signalProperty({ type: Boolean, reflect: true, attribute: 'layout-bleed' })
    bleed?: boolean;
    @signalProperty({
      type: Boolean,
      reflect: true,
      attribute: 'layout-sticky',
    })
    sticky?: boolean;
    @signalProperty({
      type: Boolean,
      reflect: true,
      attribute: 'layout-overlap',
    })
    overlap?: boolean;
    @signalProperty({
      type: Boolean,
      reflect: true,
      attribute: 'layout-divider',
    })
    divider?: boolean;
    @signalProperty({
      type: Boolean,
      reflect: true,
      attribute: 'layout-vertical',
    })
    vertical?: boolean;

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
