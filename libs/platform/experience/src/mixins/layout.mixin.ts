import { resolve } from '@spryker-oryx/di';

import {
  LayoutAttributes,
  LayoutProperties,
} from '@spryker-oryx/experience/layout';
import {
  ConnectableSignal,
  Size,
  Type,
  computed,
  featureVersion,
  signalAware,
  signalProperty,
  ssrShim,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { when } from 'lit/directives/when.js';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { LayoutController, LayoutControllerRender } from '../controllers';
import {
  CompositionLayout,
  CompositionProperties,
  StyleRuleSet,
} from '../models';
import {
  LayoutBuilder,
  LayoutPluginRender,
  LayoutService,
  LayoutTypes,
  ScreenService,
  layoutKeys,
} from '../services';
import { ContentMixin } from './content.mixin';

interface LayoutMixinRender {
  inlineStyles?: string;
  template: TemplateResult;
}

export declare class LayoutMixinInterface {
  /**
   * @deprecated since 1.2 will be deleted.
   * Property binding is not supported anymore.
   * Use attributes with the same name but together with layout prefix instead.
   * For example: bleed -> layout-grid.
   */
  bleed?: boolean;
  sticky?: boolean;
  overlap?: boolean;
  divider?: boolean;
  vertical?: boolean;
  // @deprecated since 1.2 will be removed, use layoutXs instead
  xs?: LayoutProperties;
  // @deprecated since 1.2 will be removed, use layoutSm instead
  sm?: LayoutProperties;
  // @deprecated since 1.2 will be removed, use layoutMd instead
  md?: LayoutProperties;
  // @deprecated since 1.2 will be removed, use layoutLg instead
  lg?: LayoutProperties;
  // @deprecated since 1.2 will be removed, use layoutXl instead
  xl?: LayoutProperties;
  // @deprecated since 1.2 will be removed from class declaration
  protected layoutStyles: ConnectableSignal<string | undefined>;

  layout?: CompositionLayout | LayoutTypes;
  layoutXs?: LayoutProperties;
  layoutSm?: LayoutProperties;
  layoutMd?: LayoutProperties;
  layoutLg?: LayoutProperties;
  layoutXl?: LayoutProperties;
  protected renderLayout: (props: LayoutMixinRender) => TemplateResult;
  protected [LayoutMixinInternals]: {
    layoutController: LayoutController;
    layoutService: LayoutService;
    screenService: ScreenService;
  };
  protected getLayoutPluginsRender(
    data: LayoutControllerRender
  ): Observable<LayoutPluginRender>;
  protected $screen: ConnectableSignal<Size>;
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

    protected [LayoutMixinInternals] = {
      layoutController: new LayoutController(this),
      layoutService: resolve(LayoutService),
      screenService: resolve(ScreenService, null),
    };

    // @deprecated since 1.2 will be deleted. Use LayoutMixinInternals instead
    protected layoutController = new LayoutController(this);
    // @deprecated since 1.2 will be deleted. Use LayoutMixinInternals instead
    protected layoutBuilder = resolve(LayoutBuilder);

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

    layoutAttributes$ = new BehaviorSubject<(keyof LayoutProperties)[]>([]);
    attributeFilter = computed(() => this.layoutAttributes$, {
      equal: (a, b) => JSON.stringify(a) === JSON.stringify(b),
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

      this.layoutAttributes$.next(attributeFilter);
      this.observer.observe(this, {
        attributes: true,
        attributeFilter,
      });
    }

    protected layoutStyles = computed(() =>
      this[LayoutMixinInternals].layoutController.getStyles(
        featureVersion >= '1.2'
          ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.attributeFilter()!
          : ['layout', ...layoutKeys],
        this.$options().rules,
        this.$screen()
      )
    );

    protected $screen = computed(
      () =>
        this[LayoutMixinInternals].screenService?.getScreenSize() ??
        of(undefined)
    );

    protected getLayoutPluginsRender(
      data?: LayoutControllerRender
    ): Observable<LayoutPluginRender> {
      return this[LayoutMixinInternals].layoutController.getRender({
        data: {
          ...data,
          options: this.$options() as CompositionProperties,
        },
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        attrs: this.attributeFilter()!,
        screen: this.$screen(),
      });
    }

    protected template$ = new Subject<TemplateResult>();
    protected $template = computed(() => this.template$, {
      equal: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    });
    protected $layoutRenderElement = computed(() =>
      this.getLayoutPluginsRender({ template: this.$template() })
    );

    protected renderLayout(props: LayoutMixinRender): TemplateResult | void {
      const { inlineStyles = '', template } = props;

      this.template$.next(template);
      const layoutStyles = this.layoutStyles();
      const styles = inlineStyles + layoutStyles;
      const layoutTemplate = this.$layoutRenderElement();

      if (layoutStyles === undefined) {
        return;
      }

      return html`
        ${layoutTemplate?.pre} ${layoutTemplate?.outer ?? template}
        ${when(styles, () => unsafeHTML(`<style>${styles}</style>`))}
        ${layoutTemplate?.post}
      `;
    }

    connectedCallback(): void {
      super.connectedCallback();
      if (featureVersion >= '1.2') this.observe();
    }

    disconnectedCallback(): void {
      super.disconnectedCallback();
      if (featureVersion >= '1.2') this.observer.disconnect();
    }
  }

  // Cast return type to your mixin's interface intersected with the superClass type
  return LayoutMixinClass as unknown as Type<LayoutMixinInterface> & T;
};
