import { queryAssignedElements } from '@spryker-oryx/utilities';
import { html, LitElement, ReactiveController, TemplateResult } from 'lit';
import { AffixOptions } from './affix.model';

export class AffixController implements ReactiveController {
  hostConnected?(): void;

  hostUpdated(): void {
    this.updateFill();
  }

  renderPrefix(content?: TemplateResult): TemplateResult {
    if (!content) {
      const icon = this.host.prefixIcon;
      if (this.hasContent('prefix', icon)) {
        content = html`<oryx-icon .type="${icon}"></oryx-icon>`;
        this.host.setAttribute('has-prefix', '');
      }
    } else {
      this.host.setAttribute('has-prefix', '');
    }

    return this.renderContent('prefix', content);
  }

  renderSuffix(content?: TemplateResult): TemplateResult {
    let iconContent;
    const icon = this.host.suffixIcon;
    if (this.hasContent('suffix', icon)) {
      iconContent = html`<oryx-icon .type="${icon}"></oryx-icon>`;
    }

    return this.renderContent('suffix', html`${content}${iconContent}`);
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
      'prefixFill',
      !!this.host.prefixFill &&
        (!!this.host.prefixIcon ||
          queryAssignedElements(this.host, { slot: 'prefix', flatten: true })
            ?.length > 0)
    );

    this.host.toggleAttribute(
      'suffixFill',
      !!this.host.suffixFill &&
        (!!this.host.suffixIcon ||
          queryAssignedElements(this.host, { slot: 'suffix', flatten: true })
            ?.length > 0)
    );
  }

  protected hasContent(slotName: string, icon?: string): boolean {
    return (
      !!icon || this.host?.querySelectorAll?.(`*[slot=${slotName}]`)?.length > 0
    );
  }

  constructor(protected host: AffixOptions & LitElement) {
    this.host.addController(this);
  }
}
