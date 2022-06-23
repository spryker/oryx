import { html, LitElement, TemplateResult } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { PaginationController } from './pagination.controller';
import { PaginationProperties } from './pagination.model';
import { paginationStyles } from './pagination.styles';

export class PaginationComponent
  extends LitElement
  implements PaginationProperties
{
  static styles = [paginationStyles];

  @property({ type: Boolean, reflect: true }) hideNavigation?: boolean;
  @property({ type: Number }) max = 5;
  @property({ type: Number }) current = 1;
  @property() previousLabel = 'Previous page';
  @property() nextLabel = 'Next page';
  @queryAssignedElements({}) pages?: Array<HTMLElement>;
  protected requiresUpdate = true;

  protected controller = new PaginationController(this);

  protected override render(): TemplateResult {
    return html`
      ${when(!this.hideNavigation, () =>
        this.renderNav('previous', this.controller.getPrevious(this.pages))
      )}

      <slot @slotchange=${this.updatePages}></slot>

      ${when(!this.hideNavigation, () =>
        this.renderNav('next', this.controller.getNext(this.pages))
      )}
      ${this.renderTruncated()} ${this.renderTruncated()}
    `;
  }

  protected renderNav(
    direction: 'previous' | 'next',
    nav?: HTMLElement
  ): TemplateResult {
    return html`
      <a
        href=${nav?.getAttribute('href')}
        .ariaLabel=${this[`${direction}Label`]}
        @click=${(e: MouseEvent): void => this.onClick(e, nav)}
        ?disabled=${!nav}
        ?inert=${!nav}
      >
        <slot .name=${direction}>
          <oryx-icon type="navigationArrow"></oryx-icon>
        </slot>
      </a>
    `;
  }

  /**
   * Renders a truncation element for the given direction. The truncation
   * is a visual indicator that there are more available pages hidden behind
   * the truncation.
   *
   * The truncation can be customised using the _truncation_ slot.
   *
   * @TODO consider moving the truncated out in an utility component, so that
   * we can slot in the content (currently not working twice), and it will  clean
   * this component a bit.
   */
  protected renderTruncated(): TemplateResult {
    return html`
      <span truncated>
        <slot name="truncated">
          <oryx-icon type="actions"></oryx-icon>
        </slot>
      </span>
    `;
  }

  protected onClick(event: MouseEvent, element?: HTMLElement): void {
    if (!(event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      element?.click();
    }
  }

  protected updatePages(): void {
    if (this.requiresUpdate) {
      this.requestUpdate();
      this.requiresUpdate = false;
    }

    this.controller.paginate(this.pages);
  }
}
