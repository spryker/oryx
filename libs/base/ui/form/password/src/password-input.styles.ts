import { screenStyles as inputScreenStyles } from '@spryker-oryx/ui/input';
import { css } from 'lit';

export const baseStyles = css`
  slot[name='suffix'] > oryx-icon {
    margin-inline-end: 0;
  }

  oryx-icon {
    --oryx-icon-size: var(--oryx-icon-size-md);

    cursor: pointer;
    width: 38px;
    height: 100%;
    justify-content: center;
    box-sizing: border-box;
    padding-inline-end: 10px;
  }

  svg {
    pointer-events: none;
  }

  svg .visible,
  svg .invisible {
    transition: var(--oryx-transition-time);
  }

  :host(:not([visible])) svg .invisible,
  :host([visible]) svg .visible {
    opacity: 0;
  }

  .validation-message {
    display: flex;
    align-items: center;
    color: var(--oryx-color-neutral-9);
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
  }

  oryx-error-message + .validation-message {
    margin-block-start: 15px;
  }

  .validation-message:not(:last-child) {
    margin-block-end: 5px;
  }

  .validation-message oryx-icon {
    height: 16px;
    width: 20px;
  }

  .active {
    color: var(--oryx-color-primary-11);
  }
`;

export const screenStyles = [...inputScreenStyles];
