import { css } from 'lit';

export const merchantOffersStyles = css`
  :host {
    container-type: inline-size;
  }

  oryx-collapsible::part(content) {
    display: grid;
    gap: 8px;
  }

  oryx-radio {
    align-items: start;
    margin-block-start: 2px;
  }

  @container (max-width: 430px) {
    oryx-product-media {
      display: none;
    }
  }

  oryx-product-media {
    height: 50px;
    margin-inline-start: auto;
  }

  input {
    margin-block-start: 2px;
  }
`;
