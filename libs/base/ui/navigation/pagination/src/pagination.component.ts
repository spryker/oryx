import { IconTypes } from '@spryker-oryx/ui/icon';
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

  @property({ type: Boolean, reflect: true, attribute: 'is-empty' }) isEmpty =
    true;

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
        aria-label=${this[`${direction}Label`]}
        @click=${(e: MouseEvent): void => this.onClick(e, nav)}
        ?disabled=${!nav}
        ?inert=${!nav}
      >
        <slot .name=${direction}>
          <oryx-icon .type=${IconTypes.NavigationArrow}></oryx-icon>
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
   */
  protected renderTruncated(): TemplateResult {
    return html`
      <span truncated>
        <slot name="truncated">
          <oryx-icon .type=${IconTypes.Actions}></oryx-icon>
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
    this.isEmpty = !this.pages || this.pages?.length < 2;

    if (this.requiresUpdate) {
      this.requestUpdate();
      this.requiresUpdate = false;
    }

    this.controller.paginate(this.pages);
  }
}
