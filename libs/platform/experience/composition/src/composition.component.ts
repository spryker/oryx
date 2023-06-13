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
import { when } from 'lit/directives/when.js';
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
export class CompositionComponent extends LayoutMixin(
  ContentMixin<CompositionProperties>(LitElement)
) {
  static styles: CSSResult[] = [];

  @property() uid?: string;
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
    const components = this.$components();

    if (!components?.length) return;

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
