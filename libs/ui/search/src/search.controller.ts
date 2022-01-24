import { html, LitElement, ReactiveController, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { AffixInterface } from '../../input';
import { queryFirstAssigned } from '../../utilities/query.util';
import { clearIcon } from './icons';
import {
  SearchEvent,
  SearchIconPosition,
  SearchInterface,
} from './search.model';
export class SearchController implements ReactiveController {
  protected control?: HTMLInputElement;

  hostConnected(): void {
    this.host.addEventListener('input', () => {
      this.handleInputValue();
    });

    this.host.addEventListener('keydown', (ev: KeyboardEvent) =>
      this.handleKeyEvent(ev)
    );
  }

  /**
   * Renders a search button at the start of the search control.
   *
   * The icon defaults to `search` type but can be customized by using the `prefixIcon`.
   */
  renderPrefix(): TemplateResult {
    const affixController = (this.host as LitElement & AffixInterface)
      .affixController;
    let content: TemplateResult | undefined;
    if (this.renderSearchButtonInPrefix()) {
      content = this.renderSearchButton();
    }
    return affixController
      ? affixController.renderPrefix(content)
      : html`${content}`;
  }

  /**
   * Renders the suffix content for the text control.
   *
   * Adds a button to clear the input content.
   */
  renderSuffix(): TemplateResult {
    const affixController = (this.host as LitElement & AffixInterface)
      .affixController;
    let content: TemplateResult | undefined;
    if (this.renderSearchButtonInSuffix()) {
      content = html`${this.renderSearchButton()}`;
    }
    return html`${this.renderClearButton()}${affixController
      ? affixController.renderSuffix(content)
      : html`${content}`}`;
  }

  renderSearchButtonInSuffix(): boolean {
    const position = (this.host as LitElement & SearchInterface)
      .searchIconPosition;
    return position === SearchIconPosition.END;
  }

  protected renderSearchButtonInPrefix(): boolean {
    const position = (this.host as LitElement & SearchInterface)
      .searchIconPosition;
    return !position || position === SearchIconPosition.START;
  }

  protected renderSearchButton(): TemplateResult {
    const icon =
      (this.host as LitElement & SearchInterface).searchIcon ?? 'search';
    return html`<button
      class="search"
      @click=${(): void => this.search()}
      tabindex="-1"
    >
      <oryx-icon .type=${icon}></oryx-icon>
    </button>`;
  }

  protected renderClearButton(): TemplateResult {
    const icon = (this.host as LitElement & SearchInterface).clearIcon;
    return html`<button
      class="clear"
      @click=${(ev: Event): void => this.clear(ev)}
      tabindex="-1"
    >
      ${when(
        icon,
        () => html`<oryx-icon .type=${icon}></oryx-icon>`,
        () => html`<oryx-icon>${clearIcon}</oryx-icon>`
      )}
    </button>`;
  }

  hostUpdated(): void {
    this.control = queryFirstAssigned<HTMLInputElement>(this.host, {
      selector: 'input',
      flatten: true,
    });
    this.handleInputValue();
  }

  search(): void {
    if (this.control) {
      const event = new CustomEvent<SearchEvent>('oryx.search', {
        detail: {
          query: this.control.value,
        },
        bubbles: true,
        composed: true,
      });
      this.host.dispatchEvent(event);
    }
  }

  clear(ev: Event): void {
    ev.stopPropagation();
    if (this.control) {
      this.control.value = '';
      this.host.dispatchEvent(new Event('input'));
      this.control.focus();
    }
  }

  protected handleKeyEvent(ev: KeyboardEvent): void {
    if (ev.key === 'Enter') {
      this.search();
    }
  }

  protected handleInputValue(): void {
    this.host.classList.toggle(
      'has-value',
      !!this.control && this.control.value !== ''
    );
  }

  constructor(protected host: LitElement) {
    this.host.addController(this);
  }
}
