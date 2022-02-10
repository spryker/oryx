import { html, ReactiveController, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { OryxElement } from '../../utilities';
import { queryFirstAssigned } from '../../utilities/query.util';
import { clearIcon } from './icons';
import { SearchEvent, SearchIconPosition, SearchOptions } from './search.model';
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
  get prefixContent(): TemplateResult {
    let content: TemplateResult | undefined;
    const { searchIconPosition: pos } = this.host.options;
    if (!pos || pos === SearchIconPosition.START) {
      content = this.searchButton;
    }
    return content ?? html``;
  }

  /**
   * Renders the suffix content for the text control.
   *
   * Adds a button to clear the input content.
   */
  get suffixContent(): TemplateResult {
    let content: TemplateResult | undefined;
    const { searchIconPosition: pos } = this.host.options;
    if (pos === SearchIconPosition.END) {
      content = this.searchButton;
    }
    return content ?? html``;
  }

  protected get searchButton(): TemplateResult {
    const { searchIcon: icon = 'search' } = this.host.options;
    return html`<button
      class="search"
      @click=${(): void => this.search()}
      tabindex="-1"
    >
      <oryx-icon .type=${icon}></oryx-icon>
    </button>`;
  }

  get clearButton(): TemplateResult {
    const { clearIcon: icon } = this.host.options;
    return html`<button
      class="clear"
      @click=${(ev: Event): void => this.clear(ev)}
      tabindex="-1"
    >
      ${when(
        icon,
        () => html`<oryx-icon .type=${icon} size="medium"></oryx-icon>`,
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

  protected search(): void {
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

  protected clear(ev: Event): void {
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

  constructor(protected host: OryxElement<SearchOptions>) {
    this.host.addController(this);
  }
}
