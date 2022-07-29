import { css } from 'lit';

export const styles = css`
  a {
    display: inline-flex;
    padding: 8px;
    border-radius: 4px;
    outline: none;
    background: var(--oryx-color-neutral-lighter);
    font-size: 12px;
    text-transform: uppercase;
    text-decoration: none;
    color: var(--oryx-color-ink);
    width: 53px;
    height: 50px;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    border: 2px solid var(--oryx-color-neutral-lighter);
  }

  a:hover {
    background: var(--oryx-color-neutral-greyblue);
    border-color: var(--oryx-color-neutral-greyblue);
  }

  a:active {
    background: var(--oryx-color-neutral-greyblue);
    border-color: var(--oryx-color-neutral-greyblue-darker);
  }

  a:focus-visible {
    border-color: var(--oryx-color-brand-dark);
    box-shadow: 0 0 3px var(--oryx-color-brand-dark);
  }

  oryx-icon {
    --oryx-icon-size: 38px;

    display: block;
    padding-inline-start: 6px;
  }

  .badge + oryx-icon {
    margin-inline-start: 1px;
    padding-inline-start: 0;
  }

  .badge {
    border-radius: 2px;
    background: var(--oryx-color-brand-dark);
    color: var(--oryx-color-canvas);
    position: absolute;
    inset-inline-end: 6px;
    top: 6px;
    padding: 1px 6px;
    font-weight: 500;
    line-height: 16px;
    text-align: center;
  }

  span {
    text-align: center;
    font-weight: 600;
  }

  @media (max-width: 375px) {
    a {
      display: inline-flex;
      flex-direction: row-reverse;
      align-items: center;
      justify-content: center;
      width: auto;
      height: auto;
      gap: 6px;
      border-radius: 0;
      min-width: 41px;
      padding-top: 7px;
      padding-bottom: 7px;
    }

    .badge {
      position: static;
    }

    oryx-icon {
      --oryx-icon-size: 24px;

      padding-inline-start: 0;
      margin-inline-start: 0;
    }

    span {
      display: none;
    }
  }
`;
