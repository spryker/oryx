import { html, ReactiveController, TemplateResult } from 'lit';
import { AffixController, getControl } from '../../input';
import { OryxElement } from '../../utilities';
import {
  ClearIconAppearance,
  ClearIconPosition,
  SearchEvent,
  SearchIconPosition,
  SearchOptions,
} from './search.model';
export class SearchController implements ReactiveController {
  protected affixController: AffixController;

  hostConnected(): void {
    this.host.addEventListener('input', () => {
      this.handleInputValue();
    });

    this.host.addEventListener('change', () => {
      this.handleInputValue();
    });

    this.host.addEventListener('keydown', (ev: KeyboardEvent) =>
      this.handleKeyEvent(ev)
    );
  }

  renderPrefix(): TemplateResult {
    return this.affixController.renderPrefix(this.prefixContent);
  }

  renderSuffix(): TemplateResult {
    let clearContent: TemplateResult = html``;
    const { clearIconPosition } = this.host.options;
    if (!clearIconPosition || clearIconPosition === ClearIconPosition.AFTER) {
      clearContent = this.clearButton;
    }
    return html`${clearContent}${this.affixController.renderSuffix(
      this.suffixContent
    )}`;
  }

  /**
   * Renders the prefix content for the search control.
   *
   * Adds the search button at the start of the search control when the
   * `options.searchIconPosition` is set to 'PREFIX'.
   */
  get prefixContent(): TemplateResult | undefined {
    let content: TemplateResult | undefined;
    const { searchIconPosition: pos } = this.host.options;
    if (!pos || pos === SearchIconPosition.PREFIX) {
      content = this.searchButton;
    }
    return content ?? html``;
  }

  /**
   * Renders the suffix content for the search control.
   *
   * Adds the clear button after the search control or inside the suffix.
   * Adds the search button at the end of the search control when the
   * `options.searchIconPosition` is set to 'SUFFIX'.
   */
  get suffixContent(): TemplateResult | undefined {
    const { searchIconPosition: searchPos, clearIconPosition: clearPos } =
      this.host.options;

    const clearContent =
      clearPos === ClearIconPosition.SUFFIX ? this.clearButton : undefined;

    const searchContent =
      searchPos === SearchIconPosition.SUFFIX ? this.searchButton : undefined;

    if (!clearContent && !searchContent) {
      return;
    }

    return html`${clearContent}${searchContent}`;
  }

  protected get searchButton(): TemplateResult {
    const { searchIcon: icon = 'search' } = this.host.options;
    const search = html`
      <oryx-icon
        type=${icon}
        class="search"
        @click=${(): void => this.search()}
      ></oryx-icon>
    `;
    return html`${search}`;
  }

  get clearButton(): TemplateResult {
    const { clearIcon: icon = 'remove', clearIconAppearance } =
      this.host.options;
    return html`
      <oryx-icon
        type=${icon}
        class="clear"
        appearance=${clearIconAppearance ?? ClearIconAppearance.TOGGLE}
        @click=${(ev: Event): void => this.clear(ev)}
      ></oryx-icon>
    `;
  }

  get control(): HTMLInputElement | HTMLSelectElement | undefined {
    return getControl(this.host);
  }

  hostUpdated(): void {
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
    this.host.toggleAttribute(
      'has-value',
      !!this.control && this.control.value !== ''
    );
  }

  constructor(protected host: OryxElement<SearchOptions>) {
    this.host.addController(this);

    this.affixController = new AffixController(host);
  }
}
