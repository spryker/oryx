import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    min-height: 100vh;
    background: var(--oryx-color-neutral-3);

    /* tmp, we rather use pages with layout */
    width: min(
      100%,
      min(
        var(--oryx-container-width),
        calc(100vw - (2 * var(--oryx-container-bleed, 0px)))
      )
    );
    margin: auto;
  }

  oryx-picking-header {
    box-shadow: var(--oryx-elevation-2) var(--oryx-elevation-color-2);
  }

  .warehouses-list {
    padding: 25px 30px;
  }

  .warehouses-list h1 {
    font-weight: 600;
    line-height: 24px;
    padding-block-end: 34px;
  }

  .warehouses-list h3 {
    font-weight: 500;
    line-height: 24px;
  }

  .warehouses-list oryx-button {
    margin-block-start: 16px;
  }

  .warehouses-list hr {
    margin: 16px -30px;
    height: 1px;
    background-color: var(--oryx-color-neutral-5);
    border: none;
  }

  .warehouses-list hr:last-child {
    display: none;
  }

  .fallback {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .fallback h1 {
    width: 268px;
  }

  .fallback oryx-image {
    display: block;
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-block-start: 34px;
  }

  .loading span {
    font-weight: 600;
  }

  .loading oryx-spinner {
    display: inline-flex;
  }
`;
