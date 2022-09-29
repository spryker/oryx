import { css } from 'lit';

export const styles = css`
  :host {
    --oryx-icon-size-small: 15px;
    --oryx-icon-button-color: var(--oryx-color-ink);

    display: grid;
    grid-gap: 10px;
    border-radius: 4px;
    background-color: var(--oryx-color-neutral-lightest);
    font-size: 16px;
    line-height: 1.5;
  }

  :host(:not([is-empty])) {
    padding: 20px;
  }

  h5 + *,
  oryx-collapsible > div > :last-child {
    justify-self: end;
    text-align: end;
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
  oryx-collapsible > div > :nth-child(odd),
  h5:last-of-type + div > div,
  .delivery-message {
    color: var(--oryx-color-neutral-darker);
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
  oryx-collapsible > div > :nth-child(even) {
    color: #bc4430;
  }

  oryx-collapsible > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
    padding: 10px 0;
    font-size: 1rem;
    line-height: 22px;
  }

  :host > h5:last-of-type,
  :host > h5:last-of-type + div {
    font-weight: 600;
  }

  :host > h5:last-of-type + div {
    font-size: 22px;
  }

  h5:last-of-type + div > div {
    font-size: initial;
    font-weight: initial;
  }
`;
