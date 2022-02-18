import { html, ReactiveController, TemplateResult } from 'lit';
import { OryxElement, queryAssignedElements } from '../../../utilities/';
import { AffixOptions } from './affix.model';

export class AffixController implements ReactiveController {
  hostConnected?(): void;

  hostUpdated(): void {
    this.updateFill();
  }

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

  /**
   * Updates the affix fill (prefix and suffix) whenever the affix content is provided.
   * If there's no affix content available, the fill will not be added, regardless
   * of the configured options.
   */
  protected updateFill(): void {
    this.host.toggleAttribute(
      'prefix-fill',
      !!this.host.options.prefixFill &&
        (!!this.host.options.prefixIcon ||
          queryAssignedElements(this.host, { slot: 'prefix', flatten: true })
            ?.length > 0)
    );

    this.host.toggleAttribute(
      'suffix-fill',
      !!this.host.options.suffixFill &&
        (!!this.host.options.suffixIcon ||
          queryAssignedElements(this.host, { slot: 'suffix', flatten: true })
            ?.length > 0)
    );
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
