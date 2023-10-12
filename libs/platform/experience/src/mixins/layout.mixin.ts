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

const COUNTER = Symbol.for('COUNTER');

export const LayoutMixin = <T extends Type<LitElement & LayoutAttributes>>(
  superClass: T
): Type<LayoutMixinInterface> & T => {
  @signalAware()
  @ssrShim('style')
  class LayoutMixinClass extends ContentMixin<LayoutContentOptions>(
    superClass
  ) {
    @signalProperty() [COUNTER] = 0;

    protected observer = new MutationObserver((mutationRecords) => {
      mutationRecords.map((record) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const attrName = record.attributeName!;
        const attrValue = this.getAttribute(attrName);
        (this as Record<string, unknown>)[this.getPropertyName(attrName)] =
          attrValue;
      });

      this[COUNTER]++;
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
      }, []);

      this.observer.observe(this, {
        attributes: true,
        attributeFilter: [...attrs, ...layoutSpecificAttrs],
      });
    }

    protected getPropertyName(attrName: string): string {
      const parts = attrName.split('-');
      return parts[1] ?? parts[0];
    }

    @signalProperty({ type: Object, reflect: true }) xs?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true }) sm?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true }) md?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true }) lg?: LayoutProperties;
    @signalProperty({ type: Object, reflect: true }) xl?: LayoutProperties;

    protected layoutController = new LayoutController(this);

    protected layoutStyles = computed(() => {
      console.log(this[COUNTER], 'counter');
      return this.layoutController.getStyles(
        ['layout', ...layoutKeys],
        this.$options().rules
      );
    });

    protected layoutTest = computed(() => console.log(this.layoutStyles()));

    disconnectedCallback(): void {
      super.disconnectedCallback();
      this.observer.disconnect();
    }
  }

  // Cast return type to your mixin's interface intersected with the superClass type
  return LayoutMixinClass as unknown as Type<LayoutMixinInterface> & T;
};
