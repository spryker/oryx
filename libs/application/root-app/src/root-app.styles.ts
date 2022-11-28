import { css } from 'lit';

export const styles = css`
  :host {
    /* tmp add an alias for all tokens that we have in use   */

    --oryx-color-brand-lighter: var(--oryx-color-primary-100);
    --oryx-color-brand-light: var(--oryx-color-primary-200);
    --oryx-color-brand: var(--oryx-color-primary-300);
    --oryx-color-brand-dark: var(--oryx-color-primary-400);
    --oryx-color-brand-darker: var(--oryx-color-primary-500);

    --oryx-color-canvas: var(--oryx-color-canvas-100);

    --oryx-color-neutral-lighter: var(--oryx-color-canvas-200);
    --oryx-color-neutral-light: var(--oryx-color-canvas-500);
    --oryx-color-neutral: var(--oryx-color-neutral-200);
    --oryx-color-neutral-dark: var(--oryx-color-neutral-300);
    --oryx-color-neutral-darker: var(--oryx-color-neutral-400);

    --oryx-color-neutral-lightest: var(--oryx-color-canvas-200);
    --oryx-color-neutral-greyblue: var(--oryx-color-canvas-300);

    --oryx-color-info: var(--oryx-color-info-300);
    --oryx-color-warning: var(--oryx-color-warning-300);
    --oryx-color-error: var(--oryx-color-error-300);
    --oryx-color-success: var(--oryx-color-success-300);

    --oryx-color-focus: var(--oryx-color-focus-300);
  }

  :host {
    display: block;
    font-family: var(--oryx-font);
    font-size: var(--oryx-font-size-base);
    font-weight: var(--oryx-font-weight-medium);
    letter-spacing: 0.005em;
    color: var(--oryx-color-ink);
    background-color: var(--oryx-color-canvas);
  }

  @media (max-width: 767px) {
    :host {
      --oryx-font-size-base: 16px;
      --oryx-font-weight-medium: 600;
    }
  }

  ::placeholder {
    color: var(--oryx-color-placeholder);
  }

  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  nav .products {
    display: flex;
    justify-content: right;
    align-items: center;
    flex: 1;
    font-size: 0.8em;
  }

  nav .link {
    margin: 0 12px;
    color: var(--oryx-color-canvas, #ffffff);
  }
`;
