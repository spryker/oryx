import { ButtonColor, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { AffixController } from '@spryker-oryx/ui/input';
import { LitElement, ReactiveController, TemplateResult, html } from 'lit';
import { when } from 'lit/directives/when.js';
import { getControl } from '../../../form/utilities';
import {
  CLOSE_EVENT,
  ClearIconAppearance,
  ClearIconPosition,
  OPEN_EVENT,
  SearchAttributes,
  SearchEventDetail,
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
        <oryx-button
          .type=${ButtonType.Icon}
          .color=${ButtonColor.Neutral}
          .icon=${IconTypes.Search}
        ></oryx-button>
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
    const { searchIcon: icon = IconTypes.Search } = this.host;
    return html`
      <oryx-icon
        type=${icon}
        class="search-button"
        @click=${(): void => this.search()}
      ></oryx-icon>
    `;
  }

  protected get backButton(): TemplateResult {
    const { backIcon: icon = IconTypes.Back } = this.host;
    return html`
      <oryx-icon
        type=${icon}
        class="back-button"
        @click=${(): void => this.onBack()}
      ></oryx-icon>
    `;
  }

  get clearButton(): TemplateResult {
    const { clearIcon: icon = IconTypes.Remove, clearIconAppearance } =
      this.host;
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
    const event = new CustomEvent<SearchEventDetail>('oryx.search', {
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
    const isOpened = this.host.open; //this.host.hasAttribute('open');
    this.host.open = !isOpened;
    // this.host.toggleAttribute('open', !isOpened);

    if (isOpened) {
      this.control.value = '';
    } else {
      this.control.focus();
    }

    this.dispatchToggleEvent(isOpened ? CLOSE_EVENT : OPEN_EVENT);
  }

  protected onBack(): void {
    this.host.open = false;
    // this.host.removeAttribute('open');
    this.control.value = '';
    this.dispatchToggleEvent(CLOSE_EVENT);
  }

  protected dispatchToggleEvent(eventName: string): void {
    this.host.dispatchEvent(
      new CustomEvent(eventName, { bubbles: true, composed: true })
    );
  }

  constructor(protected host: SearchAttributes & LitElement) {
    this.host.addController(this);
    this.affixController = new AffixController(host);

    this.handleInputValue = this.handleInputValue.bind(this);
    this.handleKeyEvent = this.handleKeyEvent.bind(this);
  }
}
