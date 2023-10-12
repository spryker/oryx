import {
  CompositionLayout,
  ContentMixin,
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
    @signalProperty() attributeWatchers: (keyof LayoutProperties)[] = [];
    @signalProperty({ type: Object, reflect: true }) xs?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true }) sm?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true }) md?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true }) lg?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true }) xl?: LayoutProperties;

    protected observer = new MutationObserver((mutationRecords) => {
      mutationRecords.map((record) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const attrName = record.attributeName!;
        const attrValue = this.getAttribute(attrName);
        (this as Record<string, unknown>)[this.getPropertyName(attrName)] =
          attrValue;
      });

      this.observer.disconnect();
      this.observe();
    });

    constructor() {
      super();
      this.observe();
    }

    protected observe(layoutSpecificAttrs = []): void {
      const attrs = [...this.attributes].reduce((acc: string[], attr) => {
        if (!attr.name.startsWith('layout')) return acc;
        (this as Record<string, unknown>)[this.getPropertyName(attr.name)] =
          attr.value;
        return [...acc, attr.name];
      }, layoutSpecificAttrs);

      this.attributeWatchers = attrs as (keyof LayoutProperties)[];
      this.observer.observe(this, {
        attributes: true,
        attributeFilter: attrs,
      });
    }

    protected getPropertyName(attrName: string): string {
      const parts = attrName.split('-');
      return parts[1] ?? parts[0];
    }

    protected layoutController = new LayoutController(this);

    protected layoutStyles = computed(() => {
      return this.layoutController.getStyles(
        this.attributeWatchers,
        this.$options().rules
      );
    });

    protected layoutTest = computed(() => console.log());

    disconnectedCallback(): void {
      super.disconnectedCallback();
      this.observer.disconnect();
    }
  }

  // Cast return type to your mixin's interface intersected with the superClass type
  return LayoutMixinClass as unknown as Type<LayoutMixinInterface> & T;
};
