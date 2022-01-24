import { html, LitElement, ReactiveController, TemplateResult } from 'lit';
import { AffixInterface } from './affix.model';

export class AffixController implements ReactiveController {
  hostConnected?(): void;

  renderPrefix(content?: TemplateResult): TemplateResult {
    if (!content) {
      const icon = (this.host as LitElement & AffixInterface).prefixIcon;
      if (this.hasContent('prefix', icon)) {
        content = html`<oryx-icon .type="${icon}"></oryx-icon>`;
      }
    }
    return this.renderContent('prefix', content);
  }

  renderSuffix(content?: TemplateResult): TemplateResult {
    if (!content) {
      const icon = (this.host as LitElement & AffixInterface).suffixIcon;
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

  constructor(protected host: LitElement) {
    this.host.addController(this);
  }
}
