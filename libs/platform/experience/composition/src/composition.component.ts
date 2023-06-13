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
  computed,
  effect,
  hydratable,
  signal,
  signalAware,
  signalProperty,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { when } from 'lit/directives/when.js';

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

  protected $uidFromRoute = effect(() => {
    if (!this.route) {
      return;
    }

    this.uid = (
      signal(this.experienceService.getComponent({ route: this.route }))() ?? {}
    ).id;
  });

  protected $components = computed(() => {
    if (!this.uid) {
      return [];
    }

    return (
      signal(this.experienceService.getComponent({ uid: this.uid }))()
        ?.components ?? []
    );
  });

  protected override render(): TemplateResult | void {
    const components = this.$components();

    if (!components.length) return;

    const layoutStyles = this.layoutStyles();
    const inlineStyles = this.layoutBuilder.collectStyles(components);

    return html`${repeat(
      components,
      (component) => component.id,
      (component, index) => this.renderComponent(component, index)
    )}
    ${when(layoutStyles, () => unsafeHTML(`<style>${layoutStyles}</style>`))}
    ${when(inlineStyles, () => unsafeHTML(`<style>${inlineStyles}</style>`))} `;
  }

  protected renderComponent(
    component: Component<CompositionProperties>,
    index: number
  ): TemplateResult | undefined {
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
