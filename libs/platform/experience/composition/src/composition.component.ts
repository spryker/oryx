import { resolve } from '@spryker-oryx/di';
import {
  Component,
  ComponentsRegistryService,
  CompositionLayout,
  CompositionProperties,
  ContentMixin,
  ExperienceService,
  LayoutBuilder,
  LayoutMixin,
} from '@spryker-oryx/experience';
import {
  deferHydrationAttribute,
  effect,
  elementEffect,
  hydratable,
  hydratableAttribute,
  HYDRATE_ON_DEMAND,
  signal,
  signalAware,
  signalProperty,
} from '@spryker-oryx/utilities';
import { html, isServer, LitElement, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { when } from 'lit/directives/when.js';
import { CompositionComponentsController } from './composition-components.controller';
import { HydrationService } from '@spryker-oryx/core';

@signalAware()
@hydratable()
export class CompositionComponent extends LayoutMixin(
  ContentMixin<CompositionProperties>(LitElement)
) {
  @signalProperty({ reflect: true }) uid?: string;
  @signalProperty({ reflect: true }) route?: string;

  protected experienceService = resolve(ExperienceService);
  protected registryService = resolve(ComponentsRegistryService);
  protected layoutBuilder = resolve(LayoutBuilder);
  protected hydrationService = resolve(HydrationService);

  protected componentsController = new CompositionComponentsController(this);

  @elementEffect()
  protected $uidFromRoute = effect(() => {
    if (!this.route) {
      return;
    }

    const component =
      signal(this.experienceService.getComponent({ route: this.route }))() ??
      ({} as Component);

    if (this.uid !== component.id) {
      this.uid = component.id;
    }
  });

  protected $components = signal(this.componentsController.getComponents());

  protected $hasDynamicallyVisibleSuccessor = signal(
    this.componentsController.hasDynamicallyVisibleSuccessor()
  );

  @elementEffect()
  protected hydrateOnLoad = effect(() => {
    //TODO: find better way to hydrate composition
    //with dynamically visible components
    if (
      isServer &&
      this.$hasDynamicallyVisibleSuccessor() &&
      this.getAttribute(hydratableAttribute) !== 'window:load'
    ) {
      this.setAttribute(hydratableAttribute, 'window:load');
    }
  });

  protected override render(): TemplateResult | void {
    const components = this.$components();

    if (!components?.length) return;

    const inlineStyles = this.layoutBuilder.collectStyles(components);
    const layoutStyles = this.layoutStyles() ?? '';
    const styles = inlineStyles + layoutStyles;

    return html`${repeat(
      components,
      (component) => component.id,
      (component, index) => this.renderComponent(component, index)
    )}
    ${when(styles, () => unsafeHTML(`<style>${styles}</style>`))} `;
  }

  protected renderComponent(
    component: Component<CompositionProperties>,
    index: number
  ): TemplateResult {
    const template = this.registryService.resolveTemplate({
      type: component.type,
      uid: component.id,
      markers: component.options?.data
        ? this.layoutBuilder.getLayoutMarkers(component.options.data)
        : undefined,
    });
    if (this.$options()?.rules?.[0]?.layout === CompositionLayout.Tabular) {
      return html`
        <input
          type="radio"
          name="tab"
          id=${component.id}
          ?checked=${index === 0}
        />
        <label for=${component.id}>${component.name ?? component.type}</label>
        ${template}
      `;
    }

    return html`${template}`;
  }
}
