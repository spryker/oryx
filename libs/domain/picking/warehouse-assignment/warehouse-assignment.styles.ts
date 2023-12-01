import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    background: var(--oryx-color-neutral-3);
  }

  .warehouses-list {
    padding: 25px 30px;
  }

  .warehouses-list h1 {
    ${headingUtil(HeadingTag.H2)}

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
