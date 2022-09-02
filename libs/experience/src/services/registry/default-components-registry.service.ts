import {
  AppRef,
  ComponentsPlugin,
  HYDRATE_ON_DEMAND,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { LitElement, TemplateResult } from 'lit';
import { html, unsafeStatic } from 'lit/static-html.js';
import { ComponentLayout } from '../experience';
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
    layout?: ComponentLayout
  ): TemplateResult | undefined {
    const component = this.registeredComponents[type];
    if (!component) {
      return undefined;
    }
    return component.template
      ? component.template(uid, layout)
      : html`<${unsafeStatic(component.tag)} uid=${component.id} style=${
          layout?.styles
        } class=${layout?.classes}></${unsafeStatic(component.tag)}>`;
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
