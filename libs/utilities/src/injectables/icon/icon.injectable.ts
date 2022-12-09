import { svg, TemplateResult } from 'lit';
import { IconInjectable } from './icon-default.injectable';

export class DefaultIconInjectable implements IconInjectable {
  render(type?: string, spriteUrl?: string): TemplateResult {
    return svg`
      <svg viewBox="0 0 24 24">
        <use href="${spriteUrl}" />
      </svg>
    `;
  }
}
