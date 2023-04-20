import { resolve } from '@spryker-oryx/di';
import {
  BreakpointService,
  CompositionLayout,
  ContentMixin,
  LayoutBuilder,
  LayoutService,
  ResponsiveLayoutInfo,
  StyleRuleSet,
} from '@spryker-oryx/experience';
import { LayoutAttributes } from '@spryker-oryx/experience/layout';
import {
  computed,
  ConnectableSignal,
  signalAware,
  ssrShim,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';

import { Breakpoint } from '@spryker-oryx/core';
import { Type } from '@spryker-oryx/di';
import { property } from 'lit/decorators.js';
import { map } from 'rxjs';

export declare class LayoutMixinInterface {
  protected layoutStyles: ConnectableSignal<string | undefined>;
}

export const LayoutMixin = <T extends Type<LitElement & LayoutAttributes>>(
  superClass: T
): Type<LayoutMixinInterface> & T => {
  @signalAware()
  @ssrShim('style')
  class LayoutMixinClass extends ContentMixin(superClass) {
    @property() layout?: CompositionLayout;
    @property() layoutXs?: CompositionLayout;
    @property() layoutSm?: CompositionLayout;
    @property() layoutMd?: CompositionLayout;
    @property() layoutLg?: CompositionLayout;
    @property() layoutXl?: CompositionLayout;

    @property({ type: Boolean }) bleed?: boolean;
    @property({ type: Boolean }) bleedXs?: boolean;
    @property({ type: Boolean }) bleedSm?: boolean;
    @property({ type: Boolean }) bleedMd?: boolean;
    @property({ type: Boolean }) bleedLg?: boolean;
    @property({ type: Boolean }) bleedXl?: boolean;

    @property({ type: Boolean }) sticky?: boolean;
    @property({ type: Boolean }) stickyXs?: boolean;
    @property({ type: Boolean }) stickySm?: boolean;
    @property({ type: Boolean }) stickyMd?: boolean;
    @property({ type: Boolean }) stickyLg?: boolean;
    @property({ type: Boolean }) stickyXl?: boolean;

    protected breakpointService = resolve(BreakpointService);
    protected layoutService = resolve(LayoutService);
    protected layoutBuilder = resolve(LayoutBuilder);

    protected layoutStyles = computed(() => {
      const rules = (this.$options() as { rules: StyleRuleSet[] }).rules;

      this.configureLayout(rules);
      const componentStyles = this.collectStyles(rules);
      const graph = this.getResponsiveLayouts(rules);

      return this.layoutService
        .getStyles(graph)
        .pipe(map((layoutStyles) => `${layoutStyles}\n${componentStyles}`));
    });

    protected getResponsiveLayouts(
      rules: StyleRuleSet[]
    ): ResponsiveLayoutInfo {
      const layouts: ResponsiveLayoutInfo = {};

      if (this.layout) {
        const ex = rules
          ?.filter(
            (rule) =>
              rule.breakpoint && rule.layout && rule.layout !== this.layout
          )
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .map((rule) => rule.breakpoint!);
        layouts[this.layout] = {};
        if (ex?.length) {
          layouts[this.layout].excluded = ex;
        }
      }

      if (this.bleed) {
        layouts.bleed = {};
      }

      if (this.sticky) {
        layouts.sticky = {};
      }

      // TODO: get all sizes from breakpoint service
      ['Xs', 'Sm', 'Md', 'Lg', 'Xl'].forEach((size) => {
        const layoutPropName = `layout${size}` as keyof this;

        if (this[layoutPropName]) {
          layouts[
            this[layoutPropName] as unknown as keyof ResponsiveLayoutInfo
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

      return layouts;
    }
    /**
     * Sets layout properties from the given rules. The layout rules are driven
     * by component options. If the layout has been set by the host, the rules will
     * be ignored.
     */
    protected configureLayout(rules: StyleRuleSet[]): void {
      if (rules?.find((rule) => !rule.breakpoint)?.layout) {
        this.layout ??= rules?.find((rule) => !rule.breakpoint)?.layout;
      }
      this.layoutSm ??= rules?.find((rule) => rule.breakpoint === 'sm')?.layout;
      this.layoutMd ??= rules?.find((rule) => rule.breakpoint === 'md')?.layout;
      this.layoutLg ??= rules?.find((rule) => rule.breakpoint === 'lg')?.layout;

      this.bleed ??= rules?.find((rule) => !rule.breakpoint)?.bleed;
      this.bleedSm ??= rules?.find((rule) => rule.breakpoint === 'sm')?.bleed;
      this.bleedMd ??= rules?.find((rule) => rule.breakpoint === 'md')?.bleed;
      this.bleedLg ??= rules?.find((rule) => rule.breakpoint === 'lg')?.bleed;

      this.sticky ??= rules?.find((rule) => !rule.breakpoint)?.sticky;
      this.stickySm ??= rules?.find((rule) => rule.breakpoint === 'sm')?.sticky;
      this.stickyMd ??= rules?.find((rule) => rule.breakpoint === 'md')?.sticky;
      this.stickyLg ??= rules?.find((rule) => rule.breakpoint === 'lg')?.sticky;
    }

    /**
     * Collects dynamic styles provided by component options.
     *
     * When the component does not have a layout, we add a rule to
     * ensure that the component children can transparently work with the
     * layout provided outside:
     *
     * ```css
     * :host {
     *   display: contents;
     * }
     * ```
     */
    protected collectStyles(rules: StyleRuleSet[]): string {
      let styles = '';

      if (!this.hasLayout()) {
        styles += ':host {display: contents;}\n';
      }

      if (this.uid) {
        styles += this.layoutBuilder.createStylesFromOptions(this.uid, rules);
      }

      return styles;
    }

    /**
     * Indicates whether a layout is provided to the component.
     */
    protected hasLayout(): boolean {
      return (
        !!this.layout || !!this.layoutLg || !!this.layoutMd || !!this.layoutSm
      );
    }
  }
  // Cast return type to your mixin's interface intersected with the superClass type
  return LayoutMixinClass as unknown as Type<LayoutMixinInterface> & T;
};
