import { resolve } from '@spryker-oryx/di';

import {
  LayoutAttributes,
  LayoutProperties,
} from '@spryker-oryx/experience/layout';
import {
  ConnectableSignal,
  Type,
  computed,
  signalAware,
  signalProperty,
  ssrShim,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { when } from 'lit/directives/when.js';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import {
  LayoutController,
  LayoutControllerRender,
} from '../controllers/layout.controller';
import { Component, CompositionProperties, StyleRuleSet } from '../models';
import {
  LayoutPluginRender,
  LayoutService,
  LayoutTypes,
  ScreenService,
} from '../services';
import { ContentMixin } from './content.mixin';

interface LayoutMixinRender {
  element?: LitElement;
  composition?: Component[];
  template: TemplateResult;
}

export declare class LayoutMixinInterface {
  layout?: LayoutTypes;
  layoutXs?: LayoutProperties;
  layoutSm?: LayoutProperties;
  layoutMd?: LayoutProperties;
  layoutLg?: LayoutProperties;
  layoutXl?: LayoutProperties;
  protected layoutStyles: ConnectableSignal<string | undefined>;
  protected renderLayout: (props: LayoutMixinRender) => TemplateResult;
  protected getLayoutRender(
    place: keyof LayoutPluginRender,
    data: LayoutControllerRender
  ): TemplateResult;
}

interface LayoutContentOptions {
  rules: StyleRuleSet[];
}

export const LayoutMixinInternals = Symbol('LayoutMixinInternals');

export const LayoutMixin = <T extends Type<LitElement & LayoutAttributes>>(
  superClass: T
): Type<LayoutMixinInterface> & T => {
  @signalAware()
  @ssrShim('style')
  class LayoutMixinClass extends ContentMixin<LayoutContentOptions>(
    superClass
  ) {
    @signalProperty() attributeFilter: (keyof LayoutProperties)[] = [];
    @signalProperty() layout?: LayoutTypes;
    @signalProperty({ type: Object, reflect: true, attribute: 'layout-xs' })
    layoutXs?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true, attribute: 'layout-sm' })
    layoutSm?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true, attribute: 'layout-md' })
    layoutMd?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true, attribute: 'layout-lg' })
    layoutLg?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true, attribute: 'layout-xl' })
    layoutXl?: LayoutProperties;

    protected [LayoutMixinInternals] = {
      layoutController: new LayoutController(this),
      layoutService: resolve(LayoutService),
      screenService: resolve(ScreenService),
    };

    protected observer = new MutationObserver((mutationRecords) => {
      mutationRecords.map((record) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const attrName = record.attributeName!;
        (this as Record<string, unknown>)[attrName] =
          this.getAttribute(attrName);
      });

      this.observer.disconnect();
      this.observe();
    });

    protected observe(layoutSpecificAttrs = []): void {
      const exception = [
        'layout-xs',
        'layout-sm',
        'layout-md',
        'layout-lg',
        'layout-xl',
      ];
      const attributeFilter = [...this.attributes].reduce(
        (acc: string[], attr) => {
          if (!attr.name.startsWith('layout-') || exception.includes(attr.name))
            return acc;
          (this as Record<string, unknown>)[attr.name] = attr.value;
          return [...acc, attr.name];
        },
        layoutSpecificAttrs
      ) as (keyof LayoutProperties)[];

      this.attributeFilter = attributeFilter;
      this.observer.observe(this, {
        attributes: true,
        attributeFilter,
      });
    }

    protected layoutStyles = computed(() =>
      this[LayoutMixinInternals].layoutController.getStyles(
        this.attributeFilter,
        this.$options().rules
      )
    );

    protected screen$ = computed(
      () =>
        this[LayoutMixinInternals].screenService?.getScreenSize() ??
        of(undefined)
    );

    protected getLayoutRender(
      place: keyof LayoutPluginRender,
      data: LayoutControllerRender
    ): TemplateResult {
      return this[LayoutMixinInternals].layoutController.getRender({
        place,
        data,
        attrs: this.attributeFilter,
        screen: this.screen$(),
      });
    }

    protected composition$ = new BehaviorSubject<Component[] | undefined>(
      undefined
    );
    protected compositionStyles$ = this.composition$.pipe(
      switchMap((composition) =>
        composition
          ? this[LayoutMixinInternals].layoutService.getStylesFromOptions({
              composition,
            })
          : of('')
      )
    );
    protected $compositionStyles = computed(() => this.compositionStyles$);

    protected renderLayout(props: LayoutMixinRender): TemplateResult {
      const { composition, element, template } = props;
      this.composition$.next(composition);
      const layoutStyles = this.layoutStyles() ?? '';
      const inlineStyles = this.$compositionStyles();

      const styles = inlineStyles + layoutStyles;
      const data = {
        element: element ?? this,
        options: this.$options() as CompositionProperties,
      };

      return html`
        ${this.getLayoutRender('pre', data)} ${template}
        ${when(styles, () => unsafeHTML(`<style>${styles}</style>`))}
        ${this.getLayoutRender('post', data)}
      `;
    }

    connectedCallback(): void {
      super.connectedCallback();
      this.observe();
    }

    disconnectedCallback(): void {
      super.disconnectedCallback();
      this.observer.disconnect();
    }
  }

  // Cast return type to your mixin's interface intersected with the superClass type
  return LayoutMixinClass as unknown as Type<LayoutMixinInterface> & T;
};
