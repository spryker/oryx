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
    background: var(--oryx-color-neutral-light);
    border-color: var(--oryx-color-neutral-light);
  }

  a:active {
    background: var(--oryx-color-neutral-light);
    border-color: var(--oryx-color-neutral-dark);
  }

  a:focus-visible {
    border-color: var(--oryx-color-focus);
    box-shadow: 0 0 3px var(--oryx-color-focus);
  }

  oryx-icon {
    --oryx-icon-size: 32px;

    display: block;
    padding-inline-start: 8px;
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
      width: auto;
      height: auto;
      gap: 6px;
    }

    .badge {
      position: static;
    }

    oryx-icon {
      --oryx-icon-size: 17px;

      padding-inline-start: 0;
      margin-inline-start: 0;
    }

    span {
      display: none;
    }
  }
`;
