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
import { html, isServer, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { BehaviorSubject, combineLatest, map, of, switchMap } from 'rxjs';
import { compositionStyles } from './composition.styles';

@hydratable()
export class ExperienceCompositionComponent extends ContentMixin<CompositionProperties>(
  LitElement
) {
  static styles = [compositionStyles];

  @property()
  uid = '';

  @observe()
  protected uid$ = new BehaviorSubject<string>(this.uid);

  @property()
  protected route = '';

  @observe()
  protected route$ = new BehaviorSubject<string>(this.route);

  protected experienceService = resolve(ExperienceService);
  protected registryService = resolve(ComponentsRegistryService);
  protected hasSSR = false;
  protected isHydrated = false;

  protected layoutBuilder = resolve(LayoutBuilder);

  constructor() {
    super();
    this.hasSSR = !!this.renderRoot;
  }

  protected isEmpty(): boolean {
    /**
     * Lit is using adoptedStyleSheets native feature for the styles are specified by
     * static 'styles' property:
     * https://www.w3.org/TR/cssom-1/#extensions-to-the-document-or-shadow-root-interface
     * That is not yet supported by safari:
     * https://caniuse.com/mdn-api_document_adoptedstylesheets
     *
     * In result safari uses the common approach and just creates bunch of <style> elements
     * inside components, that makes them not empty
     *
     * To overcome this limitation need to check presence of any other elements
     * inside component, except for style elements
     */
    return !this.renderRoot.querySelector(':not(slot, style)');
  }

  protected shouldRenderChildren(): boolean {
    return (
      !!this.renderRoot && !this.isEmpty() && !isServer && !this.isHydrated
    );
  }

  protected components$ = combineLatest([this.uid$, this.route$]).pipe(
    switchMap(([uid, route], index) => {
      /**
       * Provides ability to rerender components for the same route pattern.
       */
      if (index > 0) {
        this.isHydrated = true;
      }

      return (
        this.experienceService?.getComponent({ uid, route }) ||
        of({} as Component)
      );
    }),
    map((component: Component) => component?.components ?? [])
  );

  @asyncState()
  protected components = valueType(this.components$);

  // Can be safely used any time on or after calling getUpdateComplete().
  hydrateOnDemand(): void {
    if (!this.isHydrated) {
      this.isHydrated = true;
      this.requestUpdate();
    }
  }

  protected override render(): TemplateResult {
    if (!this.components) return html`Loading...`;

    return html`
      <slot></slot>
      ${this.shouldRenderChildren()
        ? html` ${[...this.renderRoot.children]}`
        : this.components
        ? html` ${this.renderComponents(this.components)} `
        : html``}
    `;
  }

  protected renderComponents(
    components: Component<CompositionProperties>[]
  ): TemplateResult {
    return html`
      <oryx-layout .uid=${this.uid} style="--item-count: ${components.length}">
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
