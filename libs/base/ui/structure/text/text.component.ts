import { prehydrate } from '@spryker-oryx/core';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { hydratable, Size, ssrShim, throttle } from '@spryker-oryx/utilities';
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

  @property({ type: Boolean }) hideToggle = false;
  @property({ type: Boolean, reflect: true }) truncated = false;
  @property({ type: Boolean }) defaultExpanded?: boolean;
  @property({ type: Boolean, reflect: true }) truncation = false;
  @property({ type: Number, reflect: true }) truncateAfter?: number;
  @property() readMoreLabel = 'Read more';

  protected resizeObserver?: ResizeObserver;

  protected willUpdate(changedProperties: PropertyValues): void {
    if (changedProperties.has('truncateAfter')) {
      this.style.setProperty(
        '--line-clamp',
        this.truncateAfter?.toString() ?? null
      );
    }

    super.willUpdate(changedProperties);
  }

  protected updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('truncateAfter')) {
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
        <slot @slotchange=${() => this.normalizeText(true)}></slot>
      </div>
      ${when(
        !this.hideToggle,
        () => html` <slot name="toggle">
          <oryx-icon-button size=${Size.Sm}>
            <button aria-label=${this.readMoreLabel} @click="${this.toggle}">
              <oryx-icon .type=${IconTypes.Dropdown}></oryx-icon>
            </button>
          </oryx-icon-button>
        </slot>`
      )}
      ${prehydrate(truncateFix, this.tagName.toLowerCase())}
    `;
  }

  protected setup(): void {
    this.normalizeText();

    if (this.resizeObserver) {
      return;
    }

    this.resizeObserver = new ResizeObserver(
      throttle(
        () => window.requestAnimationFrame(() => this.normalizeText()),
        100
      )
    );
    this.resizeObserver.observe(this.container);
  }

  protected normalizeText(forcedTruncation = false): void {
    const linesCount = this.calcLinesCount(
      this.container.children[0] as HTMLElement
    );

    const prevTruncationState = this.truncation;
    this.truncation = !!this.truncateAfter && this.truncateAfter < linesCount;

    //make the text truncated when content changes or its size
    if (forcedTruncation || (this.truncation && !prevTruncationState)) {
      this.truncated = this.truncation && !this.defaultExpanded;
    }

    this.style.setProperty('--lines-count', String(linesCount));
  }

  toggle(): void {
    this.toggleAttribute('initialized', true);

    this.truncated = !this.truncated;
  }

  protected calcLinesCount(element: HTMLElement): number {
    const lineHeight = element.style.lineHeight;
    const factor = 1000;
    element.style.lineHeight = `${factor}px`;
    const height = element.scrollHeight;
    element.style.lineHeight = lineHeight;

    return Math.floor(height / factor);
  }
}
