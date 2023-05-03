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
  hydratable,
  observe,
  signal,
  subscribe,
} from '@spryker-oryx/utilities';
import { CSSResult, html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import {
  BehaviorSubject,
  catchError,
  filter,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';

@hydratable()
export class ExperienceCompositionComponent extends LayoutMixin(
  ContentMixin<CompositionProperties>(LitElement)
) {
  static styles: CSSResult[] = [];

  @property({ reflect: true }) uid?: string;
  @property({ reflect: true }) route?: string;

  @observe()
  protected uid$ = new BehaviorSubject<string | undefined>(this.uid);

  @observe()
  protected route$ = new BehaviorSubject<string | undefined>(this.route);

  @subscribe()
  protected $uidFromRoute = this.route$.pipe(
    filter((route) => !!route),
    switchMap((route) =>
      this.experienceService
        .getComponent({ route })
        .pipe(catchError(() => of({} as Component)))
    ),
    tap((component) => (this.uid = component.id))
  );

  protected components$ = this.uid$.pipe(
    switchMap((uid) =>
      this.experienceService
        .getComponent({ uid })
        .pipe(catchError(() => of({} as Component)))
    ),
    map((component: Component) => component?.components ?? [])
  );

  protected experienceService = resolve(ExperienceService);
  protected registryService = resolve(ComponentsRegistryService);
  protected layoutBuilder = resolve(LayoutBuilder);

  protected $components = signal(this.components$);

  protected override render(): TemplateResult | void {
    return this.renderComponents(this.$components());
  }

  protected renderComponents(
    components?: Component<CompositionProperties>[]
  ): TemplateResult | void {
    if (!components) return;

    return html`${this.renderChildComponents(components)}
    ${unsafeHTML(`<style>${this.layoutStyles()}</style>`)} `;
  }

  protected renderChildComponents(
    components: Component<CompositionProperties>[]
  ): TemplateResult | void {
    return html`${repeat(
      components,
      (component) => component.id,
      (component, index) => this.renderComponent(component, index)
    )}
    ${this.addInlineStyles(components)} `;
  }

  protected renderComponent(
    component: Component<CompositionProperties>,
    index: number
  ): TemplateResult | undefined {
    const template = this.registryService.resolveTemplate(
      component.type,
      component.id,
      this.getLayoutClasses(component)
    );
    if (this.$options()?.rules?.[0].layout === CompositionLayout.Tabular) {
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

  /**
   * collects the inline styles for the components and writes them
   * in a `<style>` tag.
   * The styles are unique to the component and are not reusable, hence it's
   * ok to render them inline. Rendering them inline will improve loading them
   * as additional resources, which would cause a layout shift.
   */
  protected addInlineStyles(
    components: Component[] | void
  ): TemplateResult | void {
    if (!components) return;
    const styles = this.layoutBuilder.collectStyles(components);
    if (styles) {
      return html`${unsafeHTML(`<style>${styles}</style>`)}`;
    }
  }

  /**
   * returns the CSS classes for the given composition.
   */
  protected getLayoutClasses(component: Component): string | undefined {
    if (!component.options?.data) {
      return undefined;
    }
    return this.layoutBuilder.getLayoutClasses(component.options.data);
  }
}
