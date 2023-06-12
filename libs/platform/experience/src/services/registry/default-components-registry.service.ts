import { inject } from '@spryker-oryx/di';
import { html, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { ComponentMapping } from '../experience-tokens';
import { ComponentsRegistryService } from './components-registry.service';

export class DefaultComponentsRegistryService
  implements ComponentsRegistryService
{
  protected componentMapping?: ComponentMapping;

  constructor(
    registeredComponents = inject<ComponentMapping[]>(ComponentMapping, [])
  ) {
    this.componentMapping = registeredComponents.reduce(
      (acc, components) => ({ ...acc, ...components }),
      {}
    );
  }

  resolveTag(type: string): string {
    return this.componentMapping?.[type]?.tag ?? type;
  }

  resolveTemplate(
    type: string,
    uid: string,
    markers?: string
  ): TemplateResult | undefined {
    const component = this.componentMapping?.[type] ?? { tag: type };
    const tag = component.tag ?? type;

    return component.template
      ? component.template(uid, markers)
      : html`${unsafeHTML(`<${tag} uid=${uid} ${markers ?? ''}></${tag}>`)}`;
  }
}
