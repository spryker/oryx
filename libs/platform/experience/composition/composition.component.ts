import { resolve } from '@spryker-oryx/di';
import {
  Component,
  ComponentsRegistryService,
  CompositionProperties,
  ContentMixin,
  ExperienceService,
  LayoutBuilder,
  LayoutMixin,
} from '@spryker-oryx/experience';
import {
  effect,
  elementEffect,
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
import { CompositionComponentsController } from './composition-components.controller';

@signalAware()
@hydrate()
export class CompositionComponent extends LayoutMixin(
  ContentMixin<CompositionProperties>(LitElement)
) {
  @signalProperty({ reflect: true }) uid?: string;
  @signalProperty({ reflect: true }) route?: string;

  protected experienceService = resolve(ExperienceService);
  protected registryService = resolve(ComponentsRegistryService);
  protected layoutBuilder = resolve(LayoutBuilder);

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

  protected override render(): TemplateResult | void {
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
