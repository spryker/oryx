import { resolve } from '@spryker-oryx/di';
import {
  Component,
  CompositionLayout,
  ContentMixin,
  LayoutBuilder,
  LayoutPluginRender,
  LayoutPluginType,
  LayoutService,
  LayoutStylesOptions,
  LayoutTypes,
  ScreenService,
  StyleRuleSet,
} from '@spryker-oryx/experience';
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

interface LayoutMixinRender {
  template: TemplateResult;
  components?: Component[];
  data?: LitElement;
}

export declare class LayoutMixinInterface {
  /**
   * @deprecated since 1.2 will be deleted.
   * Use attributes with the same name but together with layout- prefix instead.
   */
  bleed?: boolean;
  sticky?: boolean;
  overlap?: boolean;
  divider?: boolean;
  vertical?: boolean;

  layout?: CompositionLayout | LayoutTypes;
  xs?: LayoutProperties;
  sm?: LayoutProperties;
  md?: LayoutProperties;
  lg?: LayoutProperties;
  xl?: LayoutProperties;
  protected layoutStyles: ConnectableSignal<string | undefined>;
  protected renderLayout: (props: LayoutMixinRender) => TemplateResult;
  protected getLayoutRender(
    place: keyof LayoutPluginRender,
    component?: Component | LitElement
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
    @signalProperty({ type: Object, reflect: true }) xs?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true }) sm?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true }) md?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true }) lg?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true }) xl?: LayoutProperties;

    protected layoutController = new LayoutController(this);
    protected layoutService = resolve(LayoutService);
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
      const attributeFilter = [...this.attributes].reduce(
        (acc: string[], attr) => {
          if (!attr.name.startsWith('layout-')) return acc;
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
      const screen = this.screen();
      const props = [
        'layout',
        ...this.attributeFilter.map(this.getPropertyName),
      ] as (keyof LayoutProperties)[];

      if (screen) {
        for (const prop of Object.values(this[screen] ?? {})) {
          if (!props.includes(prop)) props.push(prop);
        }
      }

      return this.layoutController.getStyles(props, this.$options().rules);
    });

    protected screen = computed(() => this.screenService.getScreenSize());

    protected getLayoutRender(
      place: keyof LayoutPluginRender,
      component?: Component | LitElement
    ): TemplateResult {
      const screen = this.screen();
      const props = [
        'layout',
        ...this.attributeFilter.map(this.getPropertyName),
      ];

      if (screen) {
        for (const prop of Object.values(this[screen] ?? {})) {
          if (!props.includes(prop)) props.push(prop);
        }
      }

      const getHostProp = (prop: string): string | void => {
        if (
          screen &&
          (this as unknown as Record<string, Record<string, unknown>>)[
            screen
          ]?.[prop]
        ) {
          return prop;
        }

        if ((this as Record<string, unknown>)[prop]) return prop;
      };

      const getLayoutRule = (
        param: string,
        data?: string | LayoutStylesOptions
      ): string | void => {
        const prop = param as keyof LayoutStylesOptions & 'layout';

        if (typeof data === 'string' && prop === 'layout') return data;

        if (typeof data === 'object') {
          if (prop === 'layout') return data.type;

          if (data[prop]) return prop;
        }
      };

      const getRuleProp = (prop: string) => {
        const bpData = this.$options().rules?.find(
          (rule) => rule.query?.breakpoint === screen && rule.layout
        )?.layout;

        const bpProp = getLayoutRule(prop, bpData);

        if (bpProp) return bpProp;

        const data = this.$options().rules?.find(
          (rule) => !rule.query?.breakpoint && rule.layout
        )?.layout;

        return getLayoutRule(prop, data);
      };

      return props.reduce((acc, prop) => {
        const token = getHostProp(prop) ?? getRuleProp(prop);

        if (!token) return acc;

        const type =
          prop === 'layout'
            ? LayoutPluginType.Layout
            : LayoutPluginType.Property;

        return html`${acc}
        ${this.layoutService.getRender({
          type,
          token,
          data: component,
        })?.[place]}`;
      }, html``);
    }

    protected renderLayout(props: LayoutMixinRender): TemplateResult {
      const { components, template, data } = props;
      const layoutStyles = this.layoutStyles() ?? '';
      const inlineStyles = components
        ? this.layoutBuilder.collectStyles(components)
        : '';
      const styles = inlineStyles + layoutStyles;

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
