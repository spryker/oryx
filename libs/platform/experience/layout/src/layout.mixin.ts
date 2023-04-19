import { resolve } from '@spryker-oryx/di';
import {
  Breakpoint,
  BreakpointService,
  CompositionLayout,
  ContentMixin,
  LayoutBuilder,
  StyleRuleSet,
} from '@spryker-oryx/experience';
import {
  LayoutAttributes,
  LayoutService,
  LayoutStyleSheets,
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

export declare class LayoutMixinInterface implements LayoutAttributes {
  layout?: CompositionLayout;
  bleed?: boolean;
  protected layoutStyles: ConnectableSignal<string | undefined>;
}

export const LayoutMixin = <T extends Type<LitElement & LayoutAttributes>>(
  superClass: T
): Type<LayoutMixinInterface> & T => {
  @signalAware()
  @ssrShim('style')
  class LayoutMixinClass extends ContentMixin(superClass) {
    @signalProperty({ reflect: true })
    layout?: CompositionLayout;
    @signalProperty({ reflect: true, attribute: 'layout-sm' })
    layoutSm?: CompositionLayout;
    @signalProperty({ reflect: true, attribute: 'layout-md' })
    layoutMd?: CompositionLayout;
    @signalProperty({ reflect: true, attribute: 'layout-lg' })
    layoutLg?: CompositionLayout;

    @signalProperty({ reflect: true, type: Boolean })
    bleed?: boolean;
    @signalProperty({ reflect: true, type: Boolean, attribute: 'bleed-sm' })
    bleedSm?: boolean;
    @signalProperty({ reflect: true, type: Boolean, attribute: 'bleed-md' })
    bleedMd?: boolean;
    @signalProperty({ reflect: true, type: Boolean, attribute: 'bleed-lg' })
    bleedLg?: boolean;

    @signalProperty({ reflect: true, type: Boolean })
    sticky?: boolean;
    @signalProperty({ reflect: true, type: Boolean, attribute: 'sticky-sm' })
    stickySm?: boolean;
    @signalProperty({ reflect: true, type: Boolean, attribute: 'sticky-md' })
    stickyMd?: boolean;
    @signalProperty({ reflect: true, type: Boolean, attribute: 'sticky-lg' })
    stickyLg?: boolean;

    protected breakpointService = resolve(BreakpointService);
    protected layoutService = resolve(LayoutService);
    protected layoutBuilder = resolve(LayoutBuilder);

    protected layoutStyles = computed(() => {
      const rules = (this.$options() as any as { rules: StyleRuleSet[] }).rules;
      this.layout = rules?.find((rule) => !rule.breakpoint)?.layout;
      this.layoutSm = rules?.find((rule) => rule.breakpoint === 'sm')?.layout;
      this.layoutMd = rules?.find((rule) => rule.breakpoint === 'md')?.layout;
      this.layoutLg = rules?.find((rule) => rule.breakpoint === 'lg')?.layout;
      this.bleed = rules?.find((rule) => !rule.breakpoint)?.bleed;
      this.bleedSm = rules?.find((rule) => rule.breakpoint === 'sm')?.bleed;
      this.bleedMd = rules?.find((rule) => rule.breakpoint === 'md')?.bleed;
      this.bleedLg = rules?.find((rule) => rule.breakpoint === 'lg')?.bleed;
      this.sticky = rules?.find((rule) => !rule.breakpoint)?.sticky;
      this.stickySm = rules?.find((rule) => rule.breakpoint === 'sm')?.sticky;
      this.stickyMd = rules?.find((rule) => rule.breakpoint === 'md')?.sticky;
      this.stickyLg = rules?.find((rule) => rule.breakpoint === 'lg')?.sticky;

      // const layouts: { [key: string]: CompositionLayout } = {};
      // if (this.layoutSm) layouts.sm = this.layoutSm;
      // if (this.layoutMd) layouts.md = this.layoutMd;
      // if (this.layoutLg) layouts.lg = this.layoutLg;

      const layouts: LayoutStyleSheets = {};

      if (this.layout) {
        layouts[this.layout] = {
          excluded: rules
            ?.filter(
              (rule) =>
                rule.breakpoint && rule.layout && rule.layout !== this.layout
            )
            .map((rule) => rule.breakpoint!),
        };
      }

      if (this.bleed) {
        layouts.bleed = {};
      }

      if (this.sticky) {
        layouts.sticky = {
          excluded: rules
            ?.filter((rule) => rule.breakpoint && rule.layout && !rule.sticky)
            .map((rule) => rule.breakpoint!),
        };
      }

      ['Sm', 'Md', 'Lg'].forEach((size) => {
        const layoutPropName = `layout${size}`;

        if (this[layoutPropName as keyof this]) {
          layouts[
            this[
              layoutPropName as keyof this
            ] as unknown as keyof LayoutStyleSheets
          ] = {
            included: [size.toLowerCase() as Breakpoint],
          };
        }

        if (this[`bleed${size}` as keyof this] && !this.bleed) {
          if (!layouts.bleed?.included) layouts.bleed = { included: [] };
          layouts.bleed.included?.push(size.toLowerCase() as Breakpoint);
        }

        if (this[`sticky${size}` as keyof this]) {
          if (!layouts.sticky) layouts.sticky = { included: [] };
          layouts.sticky.included?.push(size.toLowerCase() as Breakpoint);
        }
      });

      console.log('layout options', layouts);

      const componentStyles = this.layoutBuilder.createStylesFromOptions(
        this.uid!,
        rules
      );

      return this.layoutService
        .getStyles(layouts)
        .pipe(map((layoutStyles) => `${layoutStyles}\n${componentStyles}`));
    });
  }
  // Cast return type to your mixin's interface intersected with the superClass type
  return LayoutMixinClass as unknown as Type<LayoutMixinInterface> & T;
};
