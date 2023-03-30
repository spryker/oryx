import { resolve } from '@spryker-oryx/di';
import {
  Component,
  ComponentsRegistryService,
  CompositionLayout,
  CompositionProperties,
  ContentMixin,
  ExperienceService,
  LayoutBuilder,
} from '@spryker-oryx/experience';
import {
  asyncState,
  hydratable,
  observe,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { compositionStyles } from './composition.styles';

@hydratable()
export class ExperienceCompositionComponent extends ContentMixin<CompositionProperties>(
  LitElement
) {
  static styles = [compositionStyles];

  @property({ reflect: true })
  uid?: string;

  @observe()
  protected uid$ = new BehaviorSubject<string | undefined>(this.uid);

  @property({ reflect: true })
  protected route?: string;

  @observe()
  protected route$ = new BehaviorSubject<string | undefined>(this.route);

  @state()
  layoutUid = '';

  protected experienceService = resolve(ExperienceService);
  protected registryService = resolve(ComponentsRegistryService);
  protected layoutBuilder = resolve(LayoutBuilder);

  protected components$ = combineLatest([this.uid$, this.route$]).pipe(
    switchMap(([uid, route]) =>
      this.experienceService
        ?.getComponent({ uid, route })
        .pipe(catchError(() => of({} as Component)))
    ),
    tap((component) => {
      this.layoutUid = component?.id;
    }),
    map((component: Component) => component?.components ?? [])
  );

  @asyncState()
  protected components = valueType(this.components$);

  protected override render(): TemplateResult {
    if (!this.components) return html`Loading...`;

    return html`
      <slot></slot>
      ${this.renderComponents(this.components)}
    `;
  }

  protected renderComponents(
    components: Component<CompositionProperties>[]
  ): TemplateResult {
    return html`
      <oryx-layout
        .uid=${this.layoutUid}
        style="--item-count: ${components.length}"
      >
        ${components
          ? repeat(
              components,
              (component) => component.id,
              (component, index) => this.renderComponent(component, index)
            )
          : ``}
        ${this.addInlineStyles(components)}
        <style>
          [layout='tabular']:not([orientation='vertical'])
            input:not(:checked)
            + label
            + * {
            display: none;
          }
          [layout='tabular'] input:checked + label {
            color: var(--oryx-color-primary-300);
            border-color: var(--oryx-color-primary-300);
          }

          [layout='tabular'][orientation='vertical'] *:not(input):not(label) {
            transition: max-height 0.3s;
            overflow: hidden;
            max-height: 300px;
          }

          [layout='tabular'][orientation='vertical']
            input:not(:checked)
            + label
            + * {
            max-height: 0;
          }
        </style>
      </oryx-layout>
    `;
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

    if (
      this.componentOptions?.rules?.[0].layout === CompositionLayout.Tabular
    ) {
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

    return template;
  }

  /**
   * collects the inline styles for the list of components and writes them
   * in a `<style>` tag.
   * The styles are unique to the component and are not reusable, hence it's
   * ok to render them inline. Rendering them inline will improve loading them
   * as additional resources, which would cause a layout shift.
   *
   * TODO: move to layout!
   */
  protected addInlineStyles(
    components: Component[] | undefined
  ): TemplateResult {
    if (!components) return html``;
    const styles = this.layoutBuilder.collectStyles(components);
    if (styles !== '') {
      return html`${unsafeHTML(`<style>${styles}</style>`)}`;
    }

    return html``;
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
