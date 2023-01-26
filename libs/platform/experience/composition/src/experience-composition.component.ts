import { SSRAwaiterService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import {
  Component,
  ComponentMixin,
  ComponentsRegistryService,
  CompositionProperties,
  ExperienceService,
  LayoutBuilder,
} from '@spryker-oryx/experience';
import { asyncValue, hydratable, observe } from '@spryker-oryx/utilities';
import { html, isServer, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { BehaviorSubject, combineLatest, map, of, switchMap } from 'rxjs';
import { compositionStyles } from './composition.styles';

@hydratable()
export class ExperienceCompositionComponent extends ComponentMixin<CompositionProperties>() {
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
  protected ssrAwaiter = resolve(SSRAwaiterService, null);
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

  // Can be safely used any time on or after calling getUpdateComplete().
  hydrateOnDemand(): void {
    if (!this.isHydrated) {
      this.isHydrated = true;
      this.requestUpdate();
    }
  }

  protected override render(): TemplateResult {
    return html`
      <slot></slot>
      ${asyncValue(
        this.components$,
        (components) =>
          this.shouldRenderChildren()
            ? html`${[...this.renderRoot.children]}`
            : components
            ? html`<oryx-layout .uid=${this.uid}>
                ${repeat(
                  components,
                  (component) => component.id,
                  (component) =>
                    html`
                      ${this.registryService.resolveTemplate(
                        component.type,
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        component.id!,
                        this.getLayoutClasses(component)
                      )}
                    `
                )}
                ${this.addInlineStyles(components)}
              </oryx-layout> `
            : html``,
        () => html`Loading...`
      )}
    `;
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
