import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { styles } from './title.styles';
export class TitleComponent extends LitElement {
  static override styles = styles;

  @property()
  protected uid?: string;

  @property()
  protected code?: string;

  get title(): string {
    return `Title ${this.code}`;
  }

  override render(): TemplateResult {
    return html`${when(
      this.code,
      () => html`<h1 aria-label="title">${this.title}</h1>`,
      () => html``
    )}`;
  }
}
