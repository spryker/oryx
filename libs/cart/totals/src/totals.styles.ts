import { css } from 'lit';

export const styles = css`
  :host {
    --oryx-icon-size-small: 15px;
    --oryx-icon-color: --oryx-color-ink;
    --oryx-color-info: --oryx-color-ink;

    display: grid;
    grid-gap: 10px;
    border-radius: 4px;
    background: #f5f5f5;
    color: #121212;
    font-size: 16px;
    line-height: 1.5;
  }

  :host(:not([is-empty])) {
    padding: 20px;
  }

  h5 + *,
  oryx-collapsible > div > :last-child {
    justify-self: end;
  }

  h4,
  h5 {
    margin: 0;
    font-weight: 500;
    font-size: inherit;
  }

  h4 {
    grid-column: span 2;
    font-size: 18px;
  }

  h5 > span,
  oryx-collapsible > div > :first-child,
  h5:last-of-type + div > div,
  .delivery-message {
    color: #71747c;
  }

  hr {
    grid-column: span 2;
    height: 1px;
    width: 100%;
    border: none;
    background-color: #dce0e5;
  }

  oryx-icon-button {
    display: inline-block;
    vertical-align: bottom;
    margin-inline-start: 3px;
  }

  oryx-collapsible {
    grid-column: span 2;
  }

  [slot='aside'] {
    margin-inline-start: auto;
  }

  [slot='aside'],
  oryx-collapsible > div > :last-child {
    color: #bc4430;
  }

  oryx-collapsible > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
    padding: 10px 0;
    font-size: 14px;
    line-height: 22px;
  }

  h5:last-of-type,
  h5:last-of-type + div {
    font-weight: 600;
  }

  h5:last-of-type + div {
    font-size: 22px;
    text-align: end;
  }

  h5:last-of-type + div > div {
    font-size: initial;
    font-weight: initial;
  }
`;
