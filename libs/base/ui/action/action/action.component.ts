import { IconComponent, Icons, IconTypes } from '@spryker-oryx/ui/icon';
import { Size } from '@spryker-oryx/utilities';
import { html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import {
  ActionComponentAttributes,
  ButtonColor,
  ButtonType,
} from './action.model';
import { buttonStyles } from './button.styles';

export class ActionComponent
  extends LitElement
  implements ActionComponentAttributes
{
  static styles = buttonStyles;

  @property() label?: string;
  @property() icon?: Icons | string;

  @property({ reflect: true }) type?: ButtonType;
  @property({ reflect: true }) color?: ButtonColor;
  @property({ reflect: true }) size?: Size;

  @property({ type: Boolean, reflect: true }) loading?: boolean;
  @property({ type: Boolean, reflect: true }) confirmed?: boolean;
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  @property({ type: Boolean }) custom?: boolean;
  @property() href?: string;

  // @query('oryx-icon') iconEl?: IconComponent;

  @queryAssignedElements({ selector: 'a, button, oryx-icon', flatten: true })
  assignedIcons?: IconComponent[];

  protected willUpdate(props: PropertyValues): void {
    super.willUpdate(props);
    // console.log(this.icon, this.assignedIcon);
    this.setAttributes();
    const color = this.color ?? 'primary';
    this.style.setProperty('--c0', `var(--oryx-color-${color}-0, white)`);
    this.style.setProperty('--c1', `var(--oryx-color-${color}-1)`);
    this.style.setProperty('--c3', `var(--oryx-color-${color}-3)`);
    this.style.setProperty('--c8', `var(--oryx-color-${color}-8)`);
    this.style.setProperty('--c9', `var(--oryx-color-${color}-9)`);
    this.style.setProperty('--c10', `var(--oryx-color-${color}-10)`);
    // this.style.setProperty('--c12', `var(--oryx-color-${color}-12)`);
  }

  protected override render(): TemplateResult {
    const template = html`<slot
        @slotchange=${(e: Event) => this.onSlotChange(e)}
      >
        ${this.renderIcon()} ${this.label} </slot
      >${this.renderLoader()}`;

    if (this.custom) {
      return template;
    }

    if (this.href) {
      return html`<a part="link" href=${this.href}> ${template} </a>`;
    }

    return html`
      <button part="button" ?disabled=${this.disabled} ?empty=${!this.label}>
        ${template}
      </button>
    `;
  }

  protected onSlotChange(e: Event): void {
    this.setAttributes();
  }

  protected setAttributes(): void {
    const text = this.label ?? this.textContent?.trim();

    const icon =
      this.icon ||
      this.assignedIcons?.find(
        (e) => e.tagName === 'ORYX-ICON' || e.querySelector('oryx-icon')
      );

    this.toggleAttribute('with-icon', !!text && !!icon);
    // this.toggleAttribute('has-text', !!text);
    this.toggleAttribute('text-only', !!text && !icon);
    this.toggleAttribute('icon-only', !text && !!icon);

    this.toggleAttribute('inert', !!(this.loading || this.disabled));
  }

  protected renderIcon(): TemplateResult | void {
    if (!this.icon) return;
    return html`<oryx-icon .type=${this.icon}></oryx-icon>`;
  }

  protected renderLoader(): TemplateResult | void {
    if (!this.loading) return;
    return html`<oryx-icon loader .type=${IconTypes.Loader}></oryx-icon>`;
  }
}
