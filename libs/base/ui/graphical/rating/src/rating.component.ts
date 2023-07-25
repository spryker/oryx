import { hydrate, Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { RatingProperties } from './rating.model';
import {
  ratingBaseStyles,
  ratingEditModeStyles,
  ratingReadonlyStyles,
} from './styles';

/** we'll have performance issues when someone accidentally uses a high scale */
const MAX_SCALE = 25;

@hydrate()
export class RatingComponent extends LitElement implements RatingProperties {
  static styles = [
    ratingBaseStyles,
    ratingEditModeStyles,
    ratingReadonlyStyles,
  ];

  @property({ type: Number }) value?: number;
  @property({ type: Boolean, reflect: true }) readonly?: boolean;
  @property() reviewCount?: number | string;
  @property({ type: Number }) scale = 5;
  @property() characters?: string;
  @property({ reflect: true }) size?: Size.Sm | Size.Lg;

  protected override render(): TemplateResult {
    return html`
      <fieldset style=${`--rate: ${this.getValue()};`}>
        ${[...Array(Math.min(this.scale, MAX_SCALE))].map((_, i) =>
          this.renderInput(i)
        )}
      </fieldset>

      ${when(
        this.reviewCount !== undefined,
        () => html`<span class="review-count">${this.getCount()}</span>`
      )}
      ${this.renderClipPath()}
    `;
  }

  protected renderInput(i: number): TemplateResult {
    return html`<input
        @input=${(): void => this.setValue(i + 1)}
        type="radio"
        name="rating"
        value=${i + 1}
        ?required=${!this.readonly}
        ?disabled=${this.readonly}
        ?checked=${Math.round(this.getValue()) === i + 1}
        style=${`--pos: ${i + 1}`}
        aria-label=${i + 1}
      />${when(!this.readonly, () => this.renderSlot(i))}`;
  }

  protected renderSlot(i: number): TemplateResult {
    return html`<slot name=${i + 1} ?has-char=${this.hasChar(i)}
      >${this.getChar(i) ??
      html`<svg viewBox="0 0 18 18">
        <use href="#star" />
      </svg>`}</slot
    >`;
  }

  protected renderClipPath(): TemplateResult {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg">
        <clipPath id="star-path">
          <use href="#star" />
        </clipPath>
        <clipPath id="star-path-small">
          <path
            d="M9.21975 7.07491L11.8082 4.93311C12.1743 4.62895 11.9849 4.0333 11.5051 4.00796L8.17175 3.80518C7.96973 3.79251 7.79296 3.66577 7.7172 3.47567L6.49243 0.332676C6.31566 -0.110892 5.69696 -0.110892 5.52019 0.332676L4.29543 3.463C4.21967 3.6531 4.0429 3.77984 3.84088 3.79251L0.494864 3.99528C0.0150585 4.02063 -0.174338 4.61628 0.191829 4.92044L2.78025 7.04957C2.93177 7.1763 3.00753 7.39175 2.95702 7.58185L2.11105 10.8389C1.99741 11.2951 2.48984 11.6627 2.89389 11.4092L5.70959 9.59692C5.88636 9.48286 6.10101 9.48286 6.26516 9.59692L9.09348 11.4092C9.49753 11.6627 9.98996 11.2951 9.87632 10.8389L9.03035 7.59452C8.99247 7.40442 9.0556 7.20165 9.21975 7.07491Z"
          />
        </clipPath>
        <defs>
          <path
            id="star"
            d="M13.8296 10.6124L17.7123 7.39967C18.2615 6.94343 17.9774 6.04995 17.2577 6.01193L12.2576 5.70777C11.9546 5.68876 11.6894 5.49866 11.5758 5.21351L9.73865 0.499014C9.47349 -0.166338 8.54545 -0.166338 8.28029 0.499014L6.44314 5.1945C6.3295 5.47965 6.06435 5.66975 5.76131 5.68876L0.742296 5.99292C0.0225877 6.03094 -0.261508 6.92442 0.287743 7.38066L4.17038 10.5744C4.39766 10.7645 4.51129 11.0876 4.43553 11.3728L3.16658 16.2584C2.99612 16.9427 3.73477 17.494 4.34084 17.1138L8.56439 14.3954C8.82954 14.2243 9.15152 14.2243 9.39773 14.3954L13.6402 17.1138C14.2463 17.494 14.9849 16.9427 14.8145 16.2584L13.5455 11.3918C13.4887 11.1066 13.5834 10.8025 13.8296 10.6124Z"
          />
        </defs>
      </svg>
    `;
  }

  protected getValue(): number {
    return this.value ?? 0;
  }

  protected setValue(value: number): void {
    this.value = value;
  }

  protected getCount(): number | string | undefined {
    return this.reviewCount;
  }

  protected hasChar(position: number): boolean {
    return [...(this.characters ?? [])].length > position;
  }

  protected getChar(position: number): string | undefined {
    if (!this.hasChar(position)) {
      return;
    }
    return [...(this.characters ?? [])][position];
  }
}
