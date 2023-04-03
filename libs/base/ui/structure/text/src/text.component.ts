import { prehydrate } from '@spryker-oryx/core';
import { Size } from '@spryker-oryx/ui';
import { hydratable, ssrShim, throttle } from '@spryker-oryx/utilities';
import { LitElement, PropertyValues, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { html } from 'lit/static-html.js';
import { truncateFix } from './prehydrate';
import { TextProperties } from './text.model';
import { textStyles } from './text.styles';

@ssrShim('style')
@hydratable()
export class TextComponent extends LitElement implements TextProperties {
  static override styles = textStyles;

  @property({ type: Boolean })
  hideToggle = false;
  @property({ type: Boolean, reflect: true })
  truncated = false;
  @property({ type: Boolean })
  defaultExpanded?: boolean;
  @property({ type: Boolean, reflect: true })
  truncation = false;
  @property({ type: Number, reflect: true })
  truncateAfter?: number;
  @property() readMoreLabel = 'Read more';

  protected resizeObserver?: ResizeObserver;

  protected willUpdate(changedProperties: PropertyValues): void {
    if (changedProperties.has('truncateAfter') && this.truncateAfter) {
      this.style.setProperty('--line-clamp', String(this.truncateAfter));
    }

    super.willUpdate(changedProperties);
  }

  protected updated(changedProperties: PropertyValues): void {
    if (
      changedProperties.has('truncateAfter') &&
      this.truncateAfter &&
      !this.resizeObserver
    ) {
      this.setup();
    }

    super.updated(changedProperties);
  }

  disconnectedCallback(): void {
    this.resizeObserver?.unobserve(this.container);
    this.resizeObserver?.disconnect();
    super.disconnectedCallback();
  }

  protected containerRef = createRef();
  protected get container(): HTMLElement {
    return this.containerRef?.value as HTMLElement;
  }

  protected override render(): TemplateResult {
    return html`
      <div ${ref(this.containerRef)}>
        <slot></slot>
      </div>
      ${when(
        !this.hideToggle,
        () => html` <slot name="toggle">
          <oryx-icon-button size=${Size.Sm}>
            <button aria-label=${this.readMoreLabel} @click="${this.toggle}">
              <oryx-icon type="dropdown"></oryx-icon>
            </button>
          </oryx-icon-button>
        </slot>`
      )}
      ${prehydrate(truncateFix, this.tagName.toLowerCase())}
    `;
  }

  protected setup(): void {
    if (!this.truncateAfter) {
      return;
    }

    this.truncation = true;
    this.truncated = !this.defaultExpanded;

    this.resizeObserver = new ResizeObserver(
      throttle(
        () => window.requestAnimationFrame(() => this.normalizeText()),
        100
      )
    );
    this.resizeObserver.observe(this.container);
  }

  protected normalizeText(): void {
    if (!this.truncateAfter) {
      this.truncation = false;
    }

    const linesCount = this.calcLinesCount(
      this.container.children[0] as HTMLElement
    );

    this.style.setProperty('--lines-count', String(linesCount));
  }

  protected toggle(): void {
    this.toggleAttribute('initialized', true);

    this.truncated = !this.truncated;
  }

  protected calcLinesCount(element: HTMLElement): number {
    const lineHeight = element.style.lineHeight;
    const factor = 1000;
    element.style.lineHeight = `${factor}px`;
    const height = element.getBoundingClientRect().height;
    element.style.lineHeight = lineHeight;
    return Math.floor(height / factor);
  }
}
