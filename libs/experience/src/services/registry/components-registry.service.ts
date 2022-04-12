import { inject } from '@spryker-oryx/injector';
import { TemplateResult } from 'lit';
import { html, unsafeStatic } from 'lit/static-html.js';
import { from, mapTo, Observable, of, tap } from 'rxjs';
import { Services } from '../services';
import { ComponentsRegistryContract } from './components-registry.contract';

export interface RegistryComponents {
  [wildcard: string]: boolean;
}

export class ComponentsRegistryService implements ComponentsRegistryContract {
  protected resolvedComponents: RegistryComponents = {};

  constructor(
    protected registeredComponents = inject(Services.ComponentMapping)
  ) {}

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

  resolveComponent(type: string): Observable<string> {
    if (this.registeredComponents[type]) {
      if (
        this.registeredComponents[type].component &&
        !this.resolvedComponents[type]
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
}
