import { AffixController } from '@spryker-oryx/ui/input';
import { html, LitElement, ReactiveController, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { getControl } from '../../../form/utilities';
import {
  ClearIconAppearance,
  ClearIconPosition,
  SearchAttributes,
  SearchEvent,
  SearchIconPosition,
} from './searchbox.model';

export class SearchboxController implements ReactiveController {
  protected affixController: AffixController;

  hostConnected(): void {
    this.host.addEventListener('input', this.handleInputValue);
    this.host.addEventListener('change', this.handleInputValue);
    this.host.addEventListener('keydown', this.handleKeyEvent);
  }

  hostDisconnected(): void {
    this.host.removeEventListener('input', this.handleInputValue);
    this.host.removeEventListener('change', this.handleInputValue);
    this.host.removeEventListener('keydown', this.handleKeyEvent);
  }

  renderPrefix(): TemplateResult {
    return this.affixController.renderPrefix(this.prefixContent);
  }

  renderSuffix(): TemplateResult {
    const { clearIconPosition } = this.host;
    if (!clearIconPosition || clearIconPosition === ClearIconPosition.After) {
      return html`${this.clearButton}${this.affixController.renderSuffix(
        this.suffixContent
      )}`;
    } else {
      return html`${this.affixController.renderSuffix(this.suffixContent)}`;
    }
  }

  renderTrigger(): TemplateResult {
    return html`
      <slot name="trigger" @click=${() => this.onTriggerClick()}>
        <oryx-icon-button>
          <button title="search">
            <slot name="trigger-icon"
              ><oryx-icon type="search"></oryx-icon
            ></slot>
          </button>
        </oryx-icon-button>
      </slot>
    `;
  }

  /**
   * Renders the prefix content for the search control and back navigation.
   *
   * Adds the search button at the start of the search control when the
   * `options.searchIconPosition` is set to 'PREFIX'.
   */
  get prefixContent(): TemplateResult {
    const { searchIconPosition: pos } = this.host;
    return html`${this.backButton}${when(
      !pos || pos === SearchIconPosition.Prefix,
      () => html`${this.searchButton}`
    )}`;
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
      this.host;

    const clearContent =
      clearPos === ClearIconPosition.Suffix ? this.clearButton : undefined;

    const searchContent =
      searchPos === SearchIconPosition.Suffix ? this.searchButton : undefined;

    if (!clearContent && !searchContent) {
      return;
    }

    return html`${clearContent}${searchContent}`;
  }

  protected get searchButton(): TemplateResult {
    const { searchIcon: icon = 'search' } = this.host;
    return html`
      <oryx-icon
        type=${icon}
        class="search-button"
        @click=${(): void => this.search()}
      ></oryx-icon>
    `;
  }

  protected get backButton(): TemplateResult {
    const { backIcon: icon = 'back' } = this.host;
    return html`
      <oryx-icon
        type=${icon}
        class="back-button"
        @click=${(): void => this.onBack()}
      ></oryx-icon>
    `;
  }

  get clearButton(): TemplateResult {
    const { clearIcon: icon = 'remove', clearIconAppearance } = this.host;
    return html`
      <oryx-icon
        type=${icon}
        class="clear-button"
        appearance=${clearIconAppearance ?? ClearIconAppearance.Toggle}
        @mousedown=${(e: Event): void => this.muteEvents(e)}
        @click=${(ev: Event): void => this.clear(ev)}
      ></oryx-icon>
    `;
  }

  protected muteEvents(e: Event): void {
    if (this.control.value !== '') {
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
    }
  }

  protected get control(): HTMLInputElement | HTMLSelectElement {
    return getControl(this.host);
  }

  hostUpdated(): void {
    this.handleInputValue();
  }

  protected search(): void {
    const event = new CustomEvent<SearchEvent>('oryx.search', {
      detail: {
        query: this.control.value,
      },
      bubbles: true,
      composed: true,
    });
    this.host.dispatchEvent(event);
  }

  protected clear(e: Event): void {
    if (this.control.value !== '') {
      e.stopPropagation();
      this.control.value = '';
      this.control.dispatchEvent(
        new InputEvent('input', {
          bubbles: true,
          composed: true,
          inputType: 'deleteContentBackward',
        })
      );
      this.control.dispatchEvent(
        new Event('change', { bubbles: true, composed: true })
      );
      this.control.focus();
    }
  }

  protected handleKeyEvent(ev: KeyboardEvent): void {
    if (ev.key === 'Enter') {
      this.search();
    }
  }

  protected handleInputValue(): void {
    this.host.toggleAttribute('has-value', this.control.value !== '');
  }

  protected onTriggerClick(): void {
    this.host.toggleAttribute('open');
    this.control.focus();
  }

  protected onBack(): void {
    this.host.removeAttribute('open');
    this.control.value = '';
  }

  constructor(protected host: SearchAttributes & LitElement) {
    this.host.addController(this);
    this.affixController = new AffixController(host);

    this.handleInputValue = this.handleInputValue.bind(this);
    this.handleKeyEvent = this.handleKeyEvent.bind(this);
  }
}
