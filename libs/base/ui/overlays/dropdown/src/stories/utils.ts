import { states } from '@/tools/storybook';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CLOSE_EVENT } from '../../../popover';
import { Position } from '../dropdown.model';

const dropdownMaxHeight = 200;

export const renderCustomContent = (): TemplateResult => {
  const dispatchCloseEvent = (e: Event): void => {
    e.target?.dispatchEvent(
      new CustomEvent(CLOSE_EVENT, {
        composed: true,
        bubbles: true,
      })
    );
  };

  return html`
    <style>
      .custom-content {
        padding: 16px;
      }
      .custom-content :not(:last-child) {
        margin: 0 0 20px;
      }
      .custom-content input {
        width: 100%;
        box-sizing: border-box;
      }
    </style>
    <div class="custom-content">
      <h3>Some title:</h3>
      <label for="input">Input label</label>
      <input id="input" />
      <button>JUST A BUTTON</button>
      <button @click=${dispatchCloseEvent}>CLOSE BY EVENT</button>
      <button close-popover>CLOSE BY ATTR</button>
    </div>
  `;
};

export const renderOptions = (): TemplateResult => html`
  ${states.map(
    (option) =>
      html`<oryx-option close-popover value=${option}>${option}</oryx-option>`
  )}
`;

@customElement('container-component')
class ContainerComponent extends LitElement {
  @property({ type: Array }) positions: Position[] = [];
  @property({ type: Boolean }) vertical = false;

  connectedCallback(): void {
    super.connectedCallback();

    // a bit tricky way to open dropdowns, but hooks inside components run earlier then
    // storybook apply the size decorator and position of popover can be wrong
    setTimeout(() => {
      this.renderRoot
        .querySelectorAll('oryx-dropdown')
        .forEach((dropdown) =>
          (dropdown as HTMLElement).dispatchEvent(new MouseEvent('mousedown'))
        );
    }, 0);
  }

  render(): TemplateResult {
    return html`
      <style>
        .container {
          padding: 0px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-width: calc(100vw - 2rem);
          min-height: calc(100vh - 2rem);
        }

        .container > div {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          height: ${dropdownMaxHeight}px;
        }

        .container > div:last-child {
          align-items: flex-end;
        }

        oryx-dropdown {
          --oryx-transition-time: 0s;
          --oryx-popover-maxheight: ${dropdownMaxHeight}px;
        }
      </style>

      <div class="container">
        ${Array.from(new Array(2).keys()).map(
          () => html`
            <div>
              ${this.positions.map(
                (position) => html`
                  <oryx-dropdown
                    position=${position}
                    ?vertical-align=${this.vertical}
                  >
                    ${renderOptions()}
                  </oryx-dropdown>
                `
              )}
            </div>
          `
        )}
      </div>
    `;
  }
}
