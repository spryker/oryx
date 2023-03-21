import { inject } from '@spryker-oryx/di';
import { TemplateResult } from 'lit';
import { html, unsafeStatic } from 'lit/static-html.js';
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
}
