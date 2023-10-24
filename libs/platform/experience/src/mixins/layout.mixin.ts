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
import { LayoutController } from '../controllers/layout.controller';
import {
  Component,
  CompositionLayout,
  CompositionProperties,
  StyleRuleSet,
} from '../models';
import {
  LayoutBuilder,
  LayoutPluginParams,
  LayoutPluginRender,
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
  /**
   * @deprecated since 1.2 will be deleted.
   * Use attributes with the same name but together with layout prefix instead.
   */
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

  layout?: CompositionLayout | LayoutTypes;
  layoutXs?: LayoutProperties;
  layoutSm?: LayoutProperties;
  layoutMd?: LayoutProperties;
  layoutLg?: LayoutProperties;
  layoutXl?: LayoutProperties;
  protected layoutStyles: ConnectableSignal<string | undefined>;
  protected renderLayout: (props: LayoutMixinRender) => TemplateResult;
  protected getLayoutRender(
    place: keyof LayoutPluginRender,
    data: Omit<LayoutPluginParams, 'options'> & {
      options?: CompositionProperties;
    }
  ): TemplateResult;
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
    constructor() {
      super();
      this.observe();
    }

    @signalProperty() attributeFilter: (keyof LayoutProperties)[] = [];
    @signalProperty() layout?: CompositionLayout | LayoutTypes;
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

    @signalProperty({ type: Object, reflect: true })
    xs?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true }) sm?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true }) md?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true }) lg?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true }) xl?: LayoutProperties;

    protected layoutController = new LayoutController(this);
    protected layoutBuilder = resolve(LayoutBuilder);
    protected screenService = resolve(ScreenService);

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

    protected getPropertyName(attrName: string): keyof LayoutProperties {
      return attrName === 'layout'
        ? attrName
        : (attrName.replace('layout-', '') as keyof LayoutProperties);
    }

    protected layoutStyles = computed(() => {
      const props = [
        'layout',
        ...this.attributeFilter.map(this.getPropertyName),
      ] as (keyof LayoutProperties)[];

      return this.layoutController.getStyles(props, this.$options().rules);
    });

    protected screen = computed(() => this.screenService.getScreenSize());

    protected getLayoutRender(
      place: keyof LayoutPluginRender,
      data: Omit<LayoutPluginParams, 'options'> & {
        options?: CompositionProperties;
      }
    ): TemplateResult {
      return this.layoutController.getRender({
        place,
        data,
        attrs: ['layout', ...this.attributeFilter.map(this.getPropertyName)],
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        screen: this.screen()!,
      });
    }

    protected renderLayout(props: LayoutMixinRender): TemplateResult {
      const { composition, element, template } = props;
      const layoutStyles = this.layoutStyles() ?? '';
      const inlineStyles = composition
        ? this.layoutBuilder.collectStyles(composition)
        : '';
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
