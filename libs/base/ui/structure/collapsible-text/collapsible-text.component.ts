import { preHydrate } from '@spryker-oryx/core';
import { hydratable, i18n, Size, throttle } from '@spryker-oryx/utilities';
import { html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';
import { ButtonType } from '../../action/button/src/button.model';
import { IconTypes } from '../../graphical/icon/src/icon.types';
import {
  CollapsibleTextProperties,
  CollapsibleTextToggle,
} from './collapsible-text.model';
import { collapsibleTextStyles } from './collapsible-text.styles';
import { truncateFix } from './pre-hydrate';

@hydratable(['mouseover', 'focus'])
export class CollapsibleTextComponent
  extends LitElement
  implements CollapsibleTextProperties
{
  static styles = collapsibleTextStyles;

  @property() lineClamp?: number;
  @property() toggle?: CollapsibleTextToggle;
  @property({ reflect: true, type: Boolean }) expanded?: boolean;

  @query('slot') wrapper?: HTMLElement;

  protected resizeObserver?: ResizeObserver;

  protected updated(changedProperties: PropertyValues): void {
    if (!this.resizeObserver) {
      this.resizeObserver = new ResizeObserver(
        throttle(
          () =>
            window.requestAnimationFrame(() => {
              this.calc();
            }),
          100
        )
      );
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.resizeObserver.observe(this.wrapper!);
    }

    super.updated(changedProperties);
  }

  protected calc(): void {
    if (this.wrapper && this.lineClamp) {
      const lineHeight = parseInt(getComputedStyle(this.wrapper).lineHeight);
      const lineCount = this.wrapper.scrollHeight / lineHeight;
      this.style.setProperty('--line-count', lineCount.toString());
      this.toggleAttribute('requiresToggle', lineCount > this.lineClamp);
    }
  }

  protected override render(): TemplateResult {
    return html`<slot
        style="--line-clamp: ${this.lineClamp}"
        @slotchange=${this.onSlotChange}
      ></slot>
      ${this.renderToggle()}
      ${preHydrate(truncateFix, this.tagName.toLowerCase())} `;
  }

  protected renderToggle(): TemplateResult | void {
    const i18nLabel = this.expanded ? 'read-less' : 'read-more';

    if (this.toggle === CollapsibleTextToggle.Icon) {
      return html`<oryx-icon-button .size=${Size.Sm}>
        <button
          aria-label=${i18n(`collapsible.${i18nLabel}`)}
          @click=${this.onClick}
        >
          <oryx-icon .type=${IconTypes.Dropdown}></oryx-icon>
        </button>
      </oryx-icon-button>`;
    }

    if (this.toggle === CollapsibleTextToggle.Text) {
      return html`<oryx-button .type=${ButtonType.Text} .size=${Size.Sm}>
        <button @click=${this.onClick}>${i18n(i18nLabel)}</button>
      </oryx-button>`;
    }
  }

  protected onSlotChange(): void {
    this.expanded = false;
    this.calc();
  }

  protected onClick(): void {
    this.expanded = !this.expanded;
  }
}
