import { ContextController, EntityService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import {
  Component,
  ComponentsRegistryService,
  CompositionProperties,
  ContentMixin,
  ExperienceService,
  LayoutBuilder,
  LayoutMixin,
  LayoutMixinInternals,
  LayoutPluginRender,
} from '@spryker-oryx/experience';
import { RouterService } from '@spryker-oryx/router';
import {
  computed,
  effect,
  elementEffect,
  featureVersion,
  hydratableAttribute,
  hydrate,
  signal,
  signalAware,
  signalProperty,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html, isServer } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { when } from 'lit/directives/when.js';
import { Observable, concatMap, from, map, of, reduce } from 'rxjs';
import { CompositionComponentsController } from './composition-components.controller';

@signalAware()
@hydrate()
export class CompositionComponent extends LayoutMixin(
  ContentMixin<CompositionProperties>(LitElement)
) {
  @signalProperty({ reflect: true }) uid?: string;
  @signalProperty({ reflect: true }) route?: string;

  protected experienceService = resolve(ExperienceService);
  protected routerService = resolve(RouterService);
  protected registryService = resolve(ComponentsRegistryService);
  protected layoutBuilder = resolve(LayoutBuilder);
  protected entityService = resolve(EntityService);

  protected contextController = new ContextController(this);
  protected componentsController = new CompositionComponentsController(this);

  @elementEffect()
  protected $uidFromRoute = effect(() => {
    if (!this.route) {
      return;
    }

    const component = signal(
      this.experienceService
        .getComponent({ route: this.route })
        .pipe(map((component) => (component?.id ? component : null)))
    )();

    if (component === null || !component?.id) {
      this.uid = undefined;
      return;
    }

    if (this.uid !== component?.id) {
      this.uid = component.id;
    }
  });

  protected providedContext: string[] = [];

  @elementEffect()
  protected $contextProvider = effect(() => {
    const contexts = this.$options()?.context;
    const types = [];

    if (!Object.keys(contexts ?? {}).length) {
      for (const key of this.providedContext) {
        this.contextController.remove(key);
        this.providedContext = [];
      }

      return;
    }

    for (const [type, context] of Object.entries(contexts ?? {})) {
      const key = signal(this.entityService.getContextKey(type))()! ?? type;

      if (key) {
        types.push(key);
        this.contextController.provide(key, context);
      }
    }

    for (const key of this.providedContext) {
      if (types.includes(key)) continue;
      this.contextController.remove(key);
    }

    this.providedContext = [...types];
  });

  protected $components = signal(this.componentsController.getComponents());
  protected $componentsStyles = computed(() => {
    const components = this.$components();

    if (!components?.length) return of('');

    return this[LayoutMixinInternals].layoutService.getStylesFromOptions({
      composition: components,
      screen: this.$screen(),
    });
  });

  protected $hasDynamicallyVisibleComponent = signal(
    this.componentsController.hasDynamicallyVisibleComponent()
  );

  @elementEffect()
  protected hydrateOnLoad = effect(() => {
    //TODO: find better way to hydrate composition
    //with dynamically visible components
    if (
      isServer &&
      this.$hasDynamicallyVisibleComponent() &&
      this.getAttribute(hydratableAttribute) !== 'window:load'
    ) {
      this.setAttribute(hydratableAttribute, 'window:load');
    }
  });

  protected getCompositionLayoutRender(): Observable<
    Record<string, LayoutPluginRender>
  > {
    const components = this.$components();

    if (!components?.length) return of({});

    return from(components).pipe(
      concatMap((component) => {
        return this.getLayoutPluginsRender({
          options: component.options,
          experience: component,
          template: this.renderComponent(component),
        }).pipe(map((template) => ({ [component.id]: template })));
      }),
      reduce((acc, curr) => ({ ...acc, ...(curr ?? {}) }), {})
    );
  }

  protected $layoutRenderComposition = computed(() =>
    this.getCompositionLayoutRender()
  );

  protected override render(): TemplateResult | void {
    return featureVersion >= '1.2'
      ? this.standardRender()
      : this.legacyRender();
  }

  private standardRender(): TemplateResult | void {
    const components = this.$components();

    if (!components?.length) return;

    const layoutComposition = this.$layoutRenderComposition();

    return this.renderLayout({
      template: repeat(
        components,
        (component) => component.id,
        (component) => {
          const layoutTemplate = layoutComposition?.[component.id];

          return html`
            ${layoutTemplate?.pre}
            ${layoutTemplate?.inner ?? this.renderComponent(component)}
            ${layoutTemplate?.post}
          `;
        }
      ) as TemplateResult,
      inlineStyles: this.$componentsStyles(),
    });
  }

  private legacyRender(): TemplateResult | void {
    const components = this.$components();

    if (!components?.length) return;

    const inlineStyles = this.layoutBuilder.collectStyles(components);
    const layoutStyles = this.layoutStyles() ?? '';
    const styles = inlineStyles + layoutStyles;

    return html`${repeat(
      components,
      (component) => component.id,
      (component) => this.renderComponent(component)
    )}
    ${when(styles, () => unsafeHTML(`<style>${styles}</style>`))} `;
  }

  protected renderComponent(
    component: Component<CompositionProperties>
  ): TemplateResult {
    const template = this.registryService.resolveTemplate({
      type: component.type,
      uid: component.id,
      markers: this.layoutBuilder.getLayoutMarkers(component.options),
    });
    return html`${template}`;
  }
}
