import { loadComponent } from './registry';
import { Services } from '@spryker-oryx/experience';
import { Component } from '@spryker-oryx/experience';
import { getInjector } from '@spryker-oryx/injector';
import { observe } from '@spryker-oryx/lit-rxjs';
import { LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { html, unsafeStatic } from 'lit/static-html.js';
import { ReplaySubject, switchMap, tap } from 'rxjs';

export class CompositionComponent extends LitElement {
  @property({ type: Object })
  protected components?: Array<Component>;

  @property()
  protected key?: String;

  @observe()
  protected key$ = new ReplaySubject<string>(1);

  protected experienceService = getInjector().inject(Services.Experience);

  protected components$ = this.key$.pipe(
    switchMap((key) => this.experienceService.getStructure({ key })),
    tap(async (component) => {
      this.components = component.components;
      let loaded = {};
      for (let i = 0; i < this.components.length; i++) {
        let component = this.components[i];
        if (!loaded.hasOwnProperty(component.type)) {
          await loadComponent(component.type);
          loaded[component.type] = true;
        }
      }
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
        return html`<${unsafeStatic(component.type)} componentid="${
          component.id
        }" uid="${component.id}"></${unsafeStatic(component.type)}>`;
      })}
    </div> `;
  }
}

customElements.get('composition-component') ||
  customElements.define('composition-component', CompositionComponent);
