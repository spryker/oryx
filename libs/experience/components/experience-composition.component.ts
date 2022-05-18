import { SSRAwaiterService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue, observe } from '@spryker-oryx/lit-rxjs';
import { isClient } from '@spryker-oryx/typescript-utils';
import { html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { filter, lastValueFrom, of, ReplaySubject, switchMap, tap } from 'rxjs';
import {
  Component,
  ComponentsRegistryService,
  ExperienceService,
} from '../src/services';

export class ExperienceCompositionComponent extends LitElement {
  @state()
  protected components?: Array<Component>;

  @property()
  protected key?: string;

  @observe()
  protected key$ = new ReplaySubject<string>(1);

  protected experienceService = resolve(this, ExperienceService, null);
  protected registryService = resolve(this, ComponentsRegistryService);
  protected ssrAwaiter = resolve(this, SSRAwaiterService, null);
  protected hasSSR = false;
  protected isHydrated = false;

  constructor() {
    super();
    this.hasSSR = !!this.shadowRoot;
  }

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
            this.registryService.resolveComponent(
              components![i].type,
              this.hasSSR
            )
          );
        }
        resolve?.();
      }
    })
  );

  // Can be safely used any time on or after calling getUpdateComplete().
  hydrateOnDemand(): void {
    if (!this.isHydrated) {
      this.isHydrated = true;
      this.requestUpdate();
    }
  }

  override render(): TemplateResult {
    return html`
      ${asyncValue(
        this.components$,
        (components: any) =>
          this.shadowRoot &&
          (this.shadowRoot?.children.length ?? 0) > 0 &&
          isClient() &&
          !this.isHydrated
            ? html`${[...this.shadowRoot.children]}`
            : html`${repeat(
                components,
                (component) => component.id,
                (component: any) =>
                  this.registryService.resolveTemplate(
                    component.type,
                    component.id
                  )
              )}`,
        () => html`Loading...`
      )}
    `;
  }
}
