import { IconTypes } from '@spryker-oryx/ui/icon';
import { I18nMixin } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { PaginationController } from './pagination.controller';
import { PaginationProperties } from './pagination.model';
import { paginationStyles } from './pagination.styles';

export class PaginationComponent
  extends I18nMixin(LitElement)
  implements PaginationProperties
{
  static styles = [paginationStyles];

  @property({ type: Boolean, reflect: true }) enableNavigation?: boolean;
  @property({ type: Number }) max = 5;
  @property({ type: Number }) current = 1;
  @property() previousLabel = this.i18n('oryx.pagination.previous-page');
  @property() nextLabel = this.i18n('oryx.pagination.next-page');
  @queryAssignedElements({}) pages?: Array<HTMLElement>;

  protected controller = new PaginationController(this);

  @property({ type: Boolean, reflect: true, attribute: 'is-empty' }) isEmpty =
    true;

  protected override render(): TemplateResult {
    return html`
      ${when(this.enableNavigation, () =>
        this.renderNav('previous', this.controller.getPrevious(this.pages))
      )}

      <slot @slotchange=${this.updatePages}></slot>

      ${when(this.enableNavigation, () =>
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
        <slot name=${direction}>
          <oryx-icon type=${IconTypes.NavigationArrow}></oryx-icon>
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
    if (event.ctrlKey || event.metaKey) {
      return;
    }

    event.preventDefault();
    element?.click();
  }

  protected updatePages(): void {
    this.isEmpty = !this.pages || this.pages?.length < 2;

    this.controller.paginate(this.pages);
  }
}
