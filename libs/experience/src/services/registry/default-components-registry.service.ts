import { HYDRATE_ON_DEMAND } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { isClient } from '@spryker-oryx/typescript-utils';
import { LitElement, TemplateResult } from 'lit';
import { html, unsafeStatic } from 'lit/static-html.js';
import { from, lastValueFrom, mapTo, Observable, of, tap } from 'rxjs';
import { COMPONENT_MAPPING } from '../experience-tokens';
import { ComponentsRegistryService } from './components-registry.service';

export interface RegistryComponents {
  [wildcard: string]: boolean;
}

export class DefaultComponentsRegistryService
  implements ComponentsRegistryService
{
  protected resolvedComponents: RegistryComponents = {};

  constructor(protected registeredComponents = inject(COMPONENT_MAPPING)) {}

  resolveTag(type: string): string {
    return this.registeredComponents[type]?.tag ?? type;
  }

  resolveTemplate(type: string, uid: string): TemplateResult | undefined {
    const component = this.registeredComponents[type];
    if (!component) {
      return undefined;
    }
    return component.template
      ? component.template(uid)
      : html`<${unsafeStatic(component.tag)} uid="${
          component.id
        }"></${unsafeStatic(component.tag)}>`;
  }

  resolveComponent(
    type: string,
    options?: { hasSSR?: boolean; hydratable?: boolean }
  ): Observable<string> {
    if (this.registeredComponents[type]) {
      if (
        this.registeredComponents[type].component &&
        !this.resolvedComponents[type] &&
        !customElements.get(type) &&
        !(options?.hydratable && isClient() && options.hasSSR)
      ) {
        return from(this.registeredComponents[type].component?.() || of()).pipe(
          tap(() => {
            this.resolvedComponents[type] = true;
          }),
          mapTo(this.resolveTag(type))
        );
      }
      return of(this.resolveTag(type));
    } else {
      console.error(`Missing component implementation for type ${type}.`);
    }
    return of('');
  }

  async hydrateOnDemand(element: LitElement): Promise<void> {
    if (!element.hasAttribute('hydratable')) {
      return;
    }

    if (!customElements.get(element.localName)) {
      await lastValueFrom(this.resolveComponent(element.localName));
    }
    (element as any)[HYDRATE_ON_DEMAND]?.();
  }
}
