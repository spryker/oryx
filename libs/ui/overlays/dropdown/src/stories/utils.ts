import { html, TemplateResult } from 'lit';
import { states } from '../../../../utilities/storybook';
import { CLOSE_EVENT } from '../../../popover';

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
