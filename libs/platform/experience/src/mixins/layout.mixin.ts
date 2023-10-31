import { resolve } from '@spryker-oryx/di';

import {
  LayoutAttributes,
  LayoutProperties,
} from '@spryker-oryx/experience/layout';
import {
  ConnectableSignal,
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
import {
  BehaviorSubject,
  concatMap,
  from,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import {
  LayoutController,
  LayoutControllerRender,
} from '../controllers/layout.controller';
import {
  Component,
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
        featureVersion >= '1.2'
          ? this.attributeFilter
          : ['layout', ...layoutKeys],
        this.$options().rules
      )
    );

    protected $screen = computed(
      () =>
        this[LayoutMixinInternals].screenService?.getScreenSize() ??
        of(undefined)
    );

    protected test$ = new BehaviorSubject<any>(new Map());
    protected test2$ = this.test$.pipe(
      switchMap((data) => {
        return from(data.entries()).pipe(
          concatMap(([key, value]) => {
            return value.pipe(
              map((value) => {
                return {
                  key,
                  value,
                };
              }),
              tap((value) => {
                console.log(value);
              })
            );
          })
        );
      })
    );

    protected $test = computed(() => this.test2$);

    protected getLayoutRender(
      place: keyof LayoutPluginRender,
      data: LayoutControllerRender
    ): TemplateResult {
      const data2 = this.test$.getValue();
      const obs$ = this[LayoutMixinInternals].layoutController.getRender({
        place,
        data,
        attrs: this.attributeFilter,
        screen: this.$screen(),
      });
      const templates = this.$test() as any;

      if (data.experience && !data2.has(data.experience)) {
        data2.set(data.experience, obs$);
        this.test$.next(data2);

        // return templates[data.experience as any]?.[place];
      }

      if (!data2.has(data.element)) {
        data2.set(data.element, obs$);
        this.test$.next(data2);

        // return templates[data.element as any]?.[place];
      }

      return html`hellp`;

      return templates[(data.experience ?? data.element) as any]?.[place];
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
