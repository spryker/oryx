import { css } from 'lit';

export const styles = css`
  button:not(.back) {
    --oryx-icon-color: var(--oryx-color-primary-9);
  }

  oryx-discard-picking,
  oryx-customer-note-modal {
    margin-inline-start: -12px;
  }

  .title {
    flex: 1;
  }

  .back {
    --oryx-icon-size: 18px;
  }
`;
