import { isSafari } from '@spryker-oryx/ui/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { styles } from './image.styles';

export const TAG_NAME = 'oryx-image';

export class ImageComponent extends LitElement {
  static styles = styles;

  protected move(e: Event): void {
    (e.target as HTMLSlotElement).assignedElements().forEach((element) => {
      if (isSafari() && element.hasAttribute('loading')) {
        element.removeAttribute('loading');
      }
      this.renderRoot.querySelector('picture')?.appendChild(element);
    });
  }

  protected override render(): TemplateResult {
    return html`
      <picture>
        <slot @slotchange=${this.move}></slot>
      </picture>
    `;
  }
}
