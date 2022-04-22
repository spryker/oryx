import { html, TemplateResult } from 'lit';

export const getModal = (isOpen: boolean): TemplateResult => {
  return html`
    <oryx-modal ?open=${isOpen} header="Title">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua
      </p>
    </oryx-modal>
  `;
};
