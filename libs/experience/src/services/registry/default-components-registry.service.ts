import { AppRef, ComponentsPlugin } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { HYDRATE_ON_DEMAND } from '@spryker-oryx/typescript-utils';
import { LitElement, TemplateResult } from 'lit';
import { html, unsafeStatic } from 'lit/static-html.js';
import { COMPONENT_MAPPING } from '../experience-tokens';
import { ComponentsRegistryService } from './components-registry.service';

export interface RegistryComponents {
  [wildcard: string]: boolean;
}

export class DefaultComponentsRegistryService
  implements ComponentsRegistryService
{
  protected resolvedComponents: RegistryComponents = {};

  protected readonly componentsPlugin =
    this.appRef.requirePlugin(ComponentsPlugin);

  constructor(
    protected registeredComponents = inject(COMPONENT_MAPPING),
    protected readonly appRef = inject(AppRef)
  ) {}

  resolveTag(type: string): string {
    return this.registeredComponents[type]?.tag ?? type;
  }

  resolveTemplate(
    type: string,
    uid: string,
    styleClasses?: string
  ): TemplateResult | undefined {
    const component = this.registeredComponents[type];
    if (!component) {
      return undefined;
    }
    return component.template
      ? component.template(uid, styleClasses)
      : html`<${unsafeStatic(
          component.tag ?? type
        )} uid=${uid} style=${styleClasses} class=${styleClasses}></${unsafeStatic(
          component.tag ?? type
        )}>`;
  }

  async hydrateOnDemand(element: LitElement): Promise<void> {
    if (!element.hasAttribute('hydratable')) {
      return;
    }

    if (!customElements.get(element.localName)) {
      await this.componentsPlugin.loadComponent(element.localName);
      customElements.upgrade(element);
    }

    (element as any)[HYDRATE_ON_DEMAND]?.();
  }
}
