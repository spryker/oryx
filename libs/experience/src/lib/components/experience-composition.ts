import { getInjector } from '@spryker-oryx/injector';
import { observe } from '@spryker-oryx/lit-rxjs';
import { LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { until } from 'lit/directives/until.js';
import { html, unsafeStatic } from 'lit/static-html.js';
import { lastValueFrom, ReplaySubject, switchMap, tap } from 'rxjs';
import { Component, Services } from '../services';

export class ExperienceComposition extends LitElement {
  @state()
  protected components?: Array<Component>;

  @property()
  protected key?: string;

  @observe()
  protected key$ = new ReplaySubject<string>(1);

  protected experienceService = getInjector().inject(Services.Experience);
  protected registryService = getInjector().inject(Services.ComponentsRegistry);

  protected components$ = this.key$.pipe(
    switchMap((key) => this.experienceService.getStructure({ key })),
    tap((component) => {
      this.components = component.components;
    })
  );

  override connectedCallback(): void {
    this.components$.subscribe();

    super.connectedCallback();
  }

  override render(): TemplateResult {
    if (!this.components) {
      return html``;
    }
    return html`<div>
      ${this.components.map((component) => {
        return html`${until(
          (
            lastValueFrom(
              this.registryService.resolveComponent(component.type)
            ) as Promise<string>
          ).then(
            (componentName) =>
              html`<${unsafeStatic(componentName)} componentid="${
                component.id
              }" uid="${component.id}"></${unsafeStatic(componentName)}>`
          ),
          html`<div>Loading...</div>`
        )}`;
      })}
    </div> `;
  }
}
