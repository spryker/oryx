import { script } from '@spryker-oryx/core';
import { throttle } from '@spryker-oryx/typescript-utils';
import { LitElement, PropertyValueMap, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { property } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';
import { TextProperties } from './text.model';
import { textStyles } from './text.styles';

export class TextComponent extends LitElement implements TextProperties {
  static override styles = textStyles;

  @property({ type: Number, reflect: true }) truncateAfter = 0;
  @property({ type: Boolean, reflect: true }) showToggle = false;
  @property({ type: Boolean, reflect: true }) expanded = false;

  @property() readMoreLabel = 'Read more';

  protected updated(args: PropertyValueMap<TextProperties>): void {
    if (args.has('truncateAfter') || args.has('expanded')) {
      this.setup();
    }
  }

  protected script = `async (host) => {
          const truncateAfter = host.getAttribute('truncateAfter');
          const expanded = host.hasAttribute('expanded');
          const textElement = host.shadowRoot.querySelector('div.text');
          if (textElement) {
            host.removeAttribute('requires-truncate');
            host.style.setProperty(
              '--line-clamp',
              truncateAfter > 0 ? truncateAfter.toString() : ''
            );
            host.toggleAttribute(
              'truncate',
              truncateAfter > 0 && !expanded
            );

            await 0;

            const isClamped =
              textElement.scrollHeight > textElement.clientHeight;
            const lineHeight = textElement.style.lineHeight;
            const factor = 1000;
            textElement.style.lineHeight = factor + 'px';
            const height = textElement.getBoundingClientRect().height;
            textElement.style.lineHeight = lineHeight;
            const lineCount = Math.floor(height / factor);
            host.toggleAttribute(
              'requires-truncate',
              isClamped ||
                (expanded && !!truncateAfter && lineCount > truncateAfter)
            );
          }
        };`;

  protected override render(): TemplateResult {
    return html` <div class="box">
        <div class="text">
          <slot @slotchange=${this.setup.bind(this)}></slot>
        </div>
      </div>
      ${when(
        this.showToggle,
        () => html` <slot name="toggle">
          <oryx-icon-button size="small">
            <button aria-label=${this.readMoreLabel} @click="${this.toggle}">
              <oryx-icon type="dropdown"></oryx-icon>
            </button>
          </oryx-icon-button>
        </slot>`
      )}
      ${script(this.script, 'oryx-text')}`;
  }

  protected setup(): void {
    this.removeAttribute('requires-truncate');
    this.style.setProperty(
      '--line-clamp',
      this.truncateAfter > 0 ? this.truncateAfter.toString() : ''
    );
    this.toggleAttribute('truncate', this.truncateAfter > 0 && !this.expanded);

    const observer = new ResizeObserver(throttle(() => this.onResize(), 100));
    observer.observe(this.textElement);
  }

  protected onResize(): void {
    this.toggleAttribute(
      'requires-truncate',
      this.isClamped() ||
        (this.expanded &&
          !!this.truncateAfter &&
          this.calcLinesCount(this.textElement) > this.truncateAfter)
    );
  }

  protected toggle(): void {
    this.toggleAttribute('truncate', !this.isClamped());
    this.expanded = !this.hasAttribute('truncate');

    // our CSS transition requires an initial flag after first toggle
    this.toggleAttribute('initialised', true);
  }

  protected isClamped(): boolean {
    return this.textElement.scrollHeight > this.textElement.clientHeight;
  }

  protected calcLinesCount(element: HTMLElement): number {
    const lineHeight = element.style.lineHeight;
    const factor = 1000;
    element.style.lineHeight = factor + 'px';
    const height = element.getBoundingClientRect().height;
    element.style.lineHeight = lineHeight;
    return Math.floor(height / factor);
  }

  protected get textElement(): HTMLElement {
    return this.shadowRoot?.querySelector('div.text') as HTMLElement;
  }
}
