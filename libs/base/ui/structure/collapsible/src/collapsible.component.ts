import { ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { I18nMixin, featureVersion } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import {
  CollapsibleAppearance,
  CollapsibleAttributes,
} from './collapsible.model';
import { collapsibleBaseStyle } from './styles';

export class CollapsibleComponent
  extends I18nMixin(LitElement)
  implements CollapsibleAttributes
{
  static styles = [collapsibleBaseStyle];

  @property({ reflect: true }) appearance = CollapsibleAppearance.Block;
  @property({ type: Boolean }) open?: boolean;
  @property() heading?: string;
  @property({ type: Boolean }) nonTabbable?: boolean;

  @query('details') protected details?: HTMLDetailsElement;

  /**
   * Indicates that the collapsible was opened by a user. We need this info since
   * we need to scroll the collapsible into the view port whenever it is opened by
   * the user. We do not like to do this when it's (initially) rendered `open`.
   */
  protected isManuallyOpened = false;

  protected override render(): TemplateResult {
    const nonTabbable =
      this.nonTabbable || this.appearance === CollapsibleAppearance.Inline;

    return html`
      <details
        ?open=${this.open}
        @click=${this.onClick}
        @toggle=${this.onToggle}
      >
        <summary
          part="heading"
          tabindex=${ifDefined(nonTabbable ? -1 : undefined)}
        >
          <slot name="heading">${this.heading}</slot>
          ${this.renderToggleControl()}
          <slot name="aside"></slot>
        </summary>
        <slot part="content"></slot>
      </details>
    `;
  }

  protected onToggle(): void {
    this.open = this.details?.open;
    if (featureVersion >= '1.2') {
      if (this.isManuallyOpened && this.open)
        this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      this.isManuallyOpened = false;
    }
  }

  protected onClick(): void {
    this.isManuallyOpened = true;
  }

  protected renderToggleControl(): TemplateResult {
    const icon = this.open ? IconTypes.Minus : IconTypes.Add;
    const i18nToken = `collapsible.${this.details?.open ? 'hide' : 'show'}`;
    const nonTabbable =
      this.nonTabbable || this.appearance === CollapsibleAppearance.Block;

    return html`
      <oryx-button
        .type=${ButtonType.Icon}
        .size=${ButtonSize.Sm}
        .icon=${icon}
        .label=${this.i18n(i18nToken)}
        tabindex=${ifDefined(nonTabbable ? -1 : undefined)}
        @click=${() => this.details?.toggleAttribute('open')}
      >
      </oryx-button>
    `;
  }
}
