import { css } from 'lit';

export const searchboxStyles = css`
  [slot='prefix'] {
    color: var(--oryx-color-neutral-darker);
  }

  input::placeholder {
    color: var(--oryx-color-neutral-dark);
  }

  input {
    padding-block: 16px;
    height: 56px;
  }

  oryx-button[slot='suffix'] {
    --_color-text: var(--oryx-color-brand);
  }

  oryx-icon-button[slot='suffix'] {
    --oryx-icon-button-color: var(--oryx-color-neutral-darker);
  }

  oryx-icon-button[slot='suffix'] oryx-icon {
    --oryx-icon-size: 16px;
  }

  [slot='option']::before,
  [slot='option']::after {
    height: 30px;
  }

  [slot='option']::before {
    /* stylelint-disable-next-line */
    background: linear-gradient(180deg, #fff 0, #fff0 100%);
  }

  [slot='option']::after {
    /* stylelint-disable-next-line */
    background: linear-gradient(0deg, #fff 0, #fff0 100%);
  }

  /* TODO */
  content-link::part(anchor):hover {
    color: var(--oryx-color-brand);
  }

  content-link::part(link) {
    padding: 0;
    white-space: normal;
    border-radius: 0;
  }

  .product {
    transition: background var(--oryx-transition-time);
    background: transparent;
    color: var(--oryx-color-neutral-darkest);
  }

  .product:hover {
    background: var(--oryx-color-neutral-lighter);
  }

  .product product-title {
    margin-bottom: 4px;
  }

  /* TODO: make alignments with required screen width for mobile */
  @media (min-width: 769px) {
    input {
      padding-block: 9px;
      height: 42px;
    }
  }
`;
