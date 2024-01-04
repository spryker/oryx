import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

export const couponStyles = css`
  :host {
    display: grid;
    gap: 8px;
  }

  div {
    display: grid;
    column-gap: 10px;
    align-items: center;
    grid-template-columns: max-content 1fr;
  }

  .code {
    ${headingUtil(HeadingTag.Caption)};
  }

  .name {
    grid-column: 2;
    color: var(--oryx-color-neutral-9);
  }

  oryx-icon {
    color: var(--oryx-color-success-9);
  }

  oryx-button {
    --_height: 24px;

    padding: 7px;
    margin-inline-end: 0;
  }
`;
