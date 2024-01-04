import { ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { I18nMixin, Size, featureVersion } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html, isServer } from 'lit';
import { property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import {
  CollapsibleAppearance,
  CollapsibleAttributes,
} from './collapsible.model';
import { collapsibleStyles } from './collapsible.styles';
import { collapsibleBaseStyle } from './styles';

export class CollapsibleComponent
  extends I18nMixin(LitElement)
  implements CollapsibleAttributes
{
  static styles =
    featureVersion >= '1.4' ? collapsibleStyles : [collapsibleBaseStyle];

  @property({ reflect: true }) appearance = CollapsibleAppearance.Block;
  @property({ type: Boolean, reflect: true }) open?: boolean;
  @property() heading?: string;
  @property() syncKey?: string;
  @property({ type: Boolean }) nonTabbable?: boolean;

  @query('details') protected details?: HTMLDetailsElement;

  protected firstUpdated(): void {
    if (!isServer) this.syncState();
  }

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
          part=${ifDefined(featureVersion >= '1.4' ? undefined : 'heading')}
          tabindex=${ifDefined(nonTabbable ? -1 : undefined)}
        >
          <slot name="heading"> ${this.heading} </slot>
          ${this.renderToggleControl()}
          <slot name="aside"></slot>
        </summary>
        <slot
          name=${ifDefined(featureVersion >= '1.4' ? undefined : 'content')}
        ></slot>
      </details>
    `;
  }

  protected onClick(): void {
    this.isManuallyOpened = true;
  }

  protected onToggle(): void {
    this.open = this.details?.open;
    if (featureVersion >= '1.4') this.syncState(true);
    if (featureVersion >= '1.2') {
      if (this.isManuallyOpened && this.open) {
        this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      this.isManuallyOpened = false;
    }
  }

  protected syncState(store = false): void {
    if (!this.syncKey) return;

    const uiStorageKey = 'ui';
    const uiState = JSON.parse(sessionStorage.getItem(uiStorageKey) ?? '{}');

    const collapsibleStateKey = 'collapsible';
    const collapsibleState = uiState[collapsibleStateKey] || {};

    if (store) {
      if (this.isManuallyOpened) {
        collapsibleState[this.syncKey] = this.open;
        uiState[collapsibleStateKey] = collapsibleState;
        sessionStorage.setItem(uiStorageKey, JSON.stringify(uiState));
      }
    } else {
      if (collapsibleState[this.syncKey] !== undefined) {
        this.open = collapsibleState[this.syncKey];
      }
    }
  }

  protected renderToggleControl(): TemplateResult {
    const icon =
      featureVersion >= '1.4'
        ? this.open
          ? IconTypes.DropUp
          : IconTypes.Dropdown
        : this.open
        ? IconTypes.Minus
        : IconTypes.Add;

    if (
      featureVersion >= '1.4' &&
      this.appearance === CollapsibleAppearance.Block
    ) {
      return html`<oryx-icon .type=${icon} .size=${Size.Md}></oryx-icon>`;
    }

    const i18nToken = `collapsible.${this.details?.open ? 'hide' : 'show'}`;

    return html`
      <oryx-button
        .type=${ButtonType.Icon}
        .size=${ButtonSize.Sm}
        .icon=${icon}
        .label=${this.i18n(i18nToken)}
        tabindex=${ifDefined(this.nonTabbable ? -1 : undefined)}
        @click=${() => this.details?.toggleAttribute('open')}
      >
      </oryx-button>
    `;
  }
}
