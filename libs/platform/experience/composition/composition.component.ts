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
  LayoutStylesOptions,
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

  protected $components = signal(this.componentsController.getComponents());
  protected $componentsStyles = computed(() => {
    const components = this.$components();

    if (!components?.length) return of('');

    return this[LayoutMixinInternals].layoutService.getStylesFromOptions({
      composition: components,
      screen: this.$screen(),
    });
  });
  protected $preLayoutRenderComposition = computed(() =>
    this.getCompositionLayoutRender('pre')
  );
  protected $postLayoutRenderComposition = computed(() =>
    this.getCompositionLayoutRender('post')
  );

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

  protected getCompositionLayoutRender(
    place: keyof LayoutPluginRender
  ): Observable<Record<string, TemplateResult>> {
    const components = this.$components();

    if (!components?.length) return of({});

    return from(components).pipe(
      concatMap((component) => {
        return this.getLayoutPluginsRender(place, {
          options: component.options,
          experience: component,
        }).pipe(map((template) => ({ [component.id]: template })));
      }),
      reduce((acc, curr) => ({ ...acc, ...(curr ?? {}) }), {})
    );
  }

  protected override render(): TemplateResult | void {
    return featureVersion >= '1.2'
      ? this.standardRender()
      : this.legacyRender();
  }

  private standardRender(): TemplateResult | void {
    const components = this.$components();

    if (!components?.length) return;
    // if (this.uid === 'merchant-nav')
    //   console.log(
    //     '',
    //     (this.$options()?.rules?.[0].layout as LayoutStylesOptions)
    //       ?.navigationType === 'dropdown'
    //   );
    return this.renderLayout({
      template: repeat(
        components,
        (component) => component.id,
        (component) => html`
          ${this.$preLayoutRenderComposition()?.[component.id]}
          ${this.renderComponent(component)}
          ${this.$postLayoutRenderComposition()?.[component.id]}
        `
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

    // TODO: move to plugin infrastructure, similar to pre/post, we need to be able to wrap
    if (
      (component.options?.rules?.[0].layout as LayoutStylesOptions)
        ?.navigationType === 'dropdown'
    ) {
      return html`
        <oryx-dropdown vertical-align position="end">
          <span slot="trigger">${template}</span>
          <oryx-composition
            .uid=${component?.id}
            close-popover
            .options=${{ rules: [{ layout: { type: 'list' }, gap: '0px' }] }}
            style="--oryx-content-link-padding: 0 0 0 12px;
    --oryx-link-padding: 8px 12px 8px 0;
    --oryx-link-hover-background: var(--oryx-color-neutral-3);
    --oryx-link-active-background: var(--oryx-color-primary-5);
    --oryx-link-hover-shadow:none;
    --oryx-link-active-shadow:none;
    --oryx-link-current-shadow:none;
    --oryx-link-current-color:var(--oryx-color-primary-9);"
          ></oryx-composition
        ></oryx-dropdown>
      `;
    }

    return html`${template}`;
  }
}
