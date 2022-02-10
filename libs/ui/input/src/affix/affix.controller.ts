import { html, ReactiveController, TemplateResult } from 'lit';
import { OryxElement } from '../../../utilities/';
import { AffixOptions } from './affix.model';

export class AffixController implements ReactiveController {
  hostConnected?(): void;

  renderPrefix(content?: TemplateResult): TemplateResult {
    if (!content) {
      const icon = this.host.options.prefixIcon;
      if (this.hasContent('prefix', icon)) {
        content = html`<oryx-icon .type="${icon}"></oryx-icon>`;
      }
    }
    return this.renderContent('prefix', content);
  }

  renderSuffix(content?: TemplateResult): TemplateResult {
    if (!content) {
      const icon = this.host.options.suffixIcon;
      if (this.hasContent('suffix', icon)) {
        content = html`<oryx-icon .type="${icon}"></oryx-icon>`;
      }
    }
    return this.renderContent('suffix', content);
  }

  renderContent(slotName: string, content?: TemplateResult): TemplateResult {
    return html`<slot name=${slotName}>${content}</slot>`;
  }

  protected hasContent(slotName: string, icon?: string): boolean {
    return (
      !!icon || this.host.querySelectorAll(`*[slot=${slotName}]`).length > 0
    );
  }

  constructor(protected host: OryxElement<AffixOptions>) {
    this.host.addController(this);
  }
}
