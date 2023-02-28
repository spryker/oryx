import { AppRef, ComponentsPlugin } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { HYDRATE_ON_DEMAND } from '@spryker-oryx/utilities';
import { TemplateResult } from 'lit';
import { html, unsafeStatic } from 'lit/static-html.js';
import { ComponentMapping } from '../experience-tokens';
import { ComponentsRegistryService } from './components-registry.service';

export class DefaultComponentsRegistryService
  implements ComponentsRegistryService
{
  protected readonly componentsPlugin: ComponentsPlugin;
  protected componentMapping?: ComponentMapping;

  constructor(
    registeredComponents = inject(ComponentMapping, []),
    protected readonly appRef = inject(AppRef)
  ) {
    this.componentMapping = (
      registeredComponents as Record<string, any>[]
    ).reduce((acc, components) => ({ ...acc, ...components }), {});
    this.componentsPlugin = this.appRef.requirePlugin(ComponentsPlugin);
  }

  resolveTag(type: string): string {
    return this.componentMapping?.[type]?.tag ?? type;
  }

  resolveTemplate(
    type: string,
    uid: string,
    styleClasses?: string
  ): TemplateResult | undefined {
    const component = this.componentMapping?.[type] ?? { tag: type };

    return component.template
      ? component.template(uid, styleClasses)
      : html`<${unsafeStatic(
          component.tag ?? type
        )} uid=${uid} class=${styleClasses}></${unsafeStatic(
          component.tag ?? type
        )}>${null}`;
  }

  async hydrateOnDemand(element: HTMLElement): Promise<void> {
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
