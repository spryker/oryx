import { CoreServices } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue, observe } from '@spryker-oryx/lit-rxjs';
import { html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { filter, lastValueFrom, of, ReplaySubject, switchMap, tap } from 'rxjs';
import {
  Component,
  ComponentsRegistryService,
  ExperienceService,
} from '../services';

export class ExperienceComposition extends LitElement {
  @state()
  protected components?: Array<Component>;

  @property()
  protected key?: string;

  @observe()
  protected key$ = new ReplaySubject<string>(1);

  protected experienceService = resolve(this, ExperienceService, null);
  protected registryService = resolve(this, ComponentsRegistryService);
  protected ssrAwaiter = resolve(this, CoreServices.SSRAwaiter, null);

  components$ = this.key$.pipe(
    filter((key) => !!key),
    switchMap(
      (key) => this.experienceService?.getStructure({ key }) || of({} as any)
    ),
    switchMap((structures) => of(structures?.components)),
    tap(async (components: Array<any>) => {
      if (this.key && components) {
        const resolve = this.ssrAwaiter?.getAwaiter();
        for (let i = 0; i < components!.length; i++) {
          await lastValueFrom(
            this.registryService.resolveComponent(components![i].type)
          );
        }
        resolve?.();
      }
    })
  );

  override render(): TemplateResult {
    return html`<div>
      ${asyncValue(
        this.components$,
        (components: any) =>
          html`${components.map((component: any) =>
            this.registryService.resolveTemplate(component.type, component.id)
          )}`,
        () => html`Loading...`
      )}
    </div> `;
  }
}
