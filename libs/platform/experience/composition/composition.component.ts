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
import { RouterService } from '@spryker-oryx/router';
import {
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
import { map, of, switchMap } from 'rxjs';
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
        .pipe(
          switchMap((component) =>
            component?.id
              ? of(component)
              : this.routerService.redirectNotFound().pipe(map(() => null))
          )
        )
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
    return featureVersion < '1.2' ? this.legacyRender() : this.standardRender();
  }

  private standardRender(): TemplateResult | void {
    const components = this.$components();

    if (!components?.length) return;

    return this.renderLayout({
      template: repeat(
        components,
        (component) => component.id,
        (component) => {
          console.log(
            (this as any).$preLayoutRenderComposition(),
            'asfkajsbfkasbfkj'
          );
          return html`
            ${(this as any).$preLayoutRenderComposition()?.[component.id]}
            ${this.renderComponent(component)}
            ${(this as any).$postLayoutRenderComposition()?.[component.id]}
          `;
        }
      ) as TemplateResult,
      composition: components,
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
