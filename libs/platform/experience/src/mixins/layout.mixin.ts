import { resolve } from '@spryker-oryx/di';
import {
  CompositionLayout,
  ContentMixin,
  LayoutPluginType,
  LayoutService,
  LayoutTypes,
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
import { LitElement, TemplateResult } from 'lit';
import { LayoutController } from '../controllers/layout.controller';

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
  protected layoutPrerender: ConnectableSignal<(TemplateResult | undefined)[]>;
  protected layoutPostrender: ConnectableSignal<(TemplateResult | undefined)[]>;
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

    @signalProperty() attributeWatchers: (keyof LayoutProperties)[] = [];
    @signalProperty() layout?: CompositionLayout | LayoutTypes | undefined;
    @signalProperty({ type: Object, reflect: true }) xs?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true }) sm?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true }) md?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true }) lg?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true }) xl?: LayoutProperties;

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
      const attrs = [...this.attributes].reduce((acc: string[], attr) => {
        if (!attr.name.startsWith('layout-')) return acc;
        (this as Record<string, unknown>)[attr.name] = attr.value;
        return [...acc, attr.name];
      }, layoutSpecificAttrs);

      this.attributeWatchers = attrs as (keyof LayoutProperties)[];
      this.observer.observe(this, {
        attributes: true,
        attributeFilter: attrs,
      });
    }

    protected getPropertyName(attrName: string): keyof LayoutProperties {
      return attrName.replace('layout-', '') as keyof LayoutProperties;
    }

    protected layoutController = new LayoutController(this);
    protected layoutService = resolve(LayoutService);

    protected layoutStyles = computed(() => {
      this.layout;

      return this.layoutController.getStyles(
        ['layout', ...this.attributeWatchers.map(this.getPropertyName)],
        this.$options().rules
      );
    });

    protected layoutPrerender = computed(() => {
      return this.attributeWatchers.map(
        (attr) =>
          this.layoutService.getRender(
            attr,
            attr === 'layout'
              ? LayoutPluginType.Layout
              : LayoutPluginType.Property
          )?.pre
      );
    });

    protected layoutPostrender = computed(() => {
      return this.attributeWatchers.map(
        (attr) =>
          this.layoutService.getRender(
            attr,
            attr === 'layout'
              ? LayoutPluginType.Layout
              : LayoutPluginType.Property
          )?.post
      );
    });

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
