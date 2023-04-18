import { resolve } from '@spryker-oryx/di';
import {
  CompositionLayout,
  ContentMixin,
  LayoutBuilder,
  StyleRuleSet,
} from '@spryker-oryx/experience';
import {
  LayoutAttributes,
  LayoutService,
} from '@spryker-oryx/experience/layout';
import {
  computed,
  ConnectableSignal,
  signalAware,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { Type } from '@spryker-oryx/di';
import { map } from 'rxjs';

export declare class LayoutMixinInterface implements LayoutAttributes {
  layout?: CompositionLayout;
  bleed?: boolean;
  protected layoutStyles: ConnectableSignal<string | undefined>;
}

export const LayoutMixin = <T extends Type<LitElement & LayoutAttributes>>(
  superClass: T
): Type<LayoutMixinInterface> & T => {
  @signalAware()
  class LayoutMixinClass extends ContentMixin(superClass) {
    @property({ reflect: true }) layout?: CompositionLayout;
    @property({ reflect: true, attribute: 'layout-sm' })
    layoutSm?: CompositionLayout;
    @property({ reflect: true, attribute: 'layout-md' })
    layoutMd?: CompositionLayout;
    @property({ reflect: true, attribute: 'layout-lg' })
    layoutLg?: CompositionLayout;
    @property({ reflect: true, type: Boolean }) bleed?: boolean;

    protected layoutService = resolve(LayoutService);
    protected layoutBuilder = resolve(LayoutBuilder);

    protected layoutStyles = computed(() => {
      const layouts: { [key: string]: CompositionLayout } = {};
      const rules = (this.$options() as any as { rules: StyleRuleSet[] }).rules;
      this.layout = rules?.find((rule) => !rule.breakpoint)?.layout;
      this.layoutSm = rules?.find((rule) => rule.breakpoint === 'sm')?.layout;
      this.bleed = rules?.find((rule) => !rule.breakpoint)?.bleed;

      if (this.layoutSm) layouts.sm = this.layoutSm;
      if (this.layoutMd) layouts.md = this.layoutMd;
      if (this.layoutLg) layouts.lg = this.layoutLg;

      const componentStyles = this.layoutBuilder.createStylesFromOptions(
        this.uid!,
        rules
      );

      return this.layoutService
        .getStyles(this.layout, layouts)
        .pipe(map((layoutStyles) => `${layoutStyles}\n\n${componentStyles}`));
    });
  }
  // Cast return type to your mixin's interface intersected with the superClass type
  return LayoutMixinClass as unknown as Type<LayoutMixinInterface> & T;
};
