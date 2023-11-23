import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

export const cartListStyles = css`
  :host {
    display: grid;
    gap: 10px;
  }

  .heading {
    display: flex;
    justify-content: space-between;
  }

  h1 {
    ${headingUtil(HeadingTag.H3)}
  }

  oryx-site-price {
    ${headingUtil(HeadingTag.H6)}

    margin-inline-start: auto;
  }

  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* background: var(--oryx-color-neutral-3); */
    border-block-start: 1px solid var(--oryx-color-neutral-7);
    padding: 10px 20px;
    margin-inline-start: -20px;
    width: 100%;
    height: 40px;
    margin-block-end: -12px;
    border-end-end-radius: var(
      --oryx-collapsible-border-radius,
      var(--oryx-border-radius-small)
    );
    border-end-start-radius: var(
      --oryx-collapsible-border-radius,
      var(--oryx-border-radius-small)
    );
  }

  .actions {
    display: flex;
    gap: 10px;
    margin-inline-start: auto;
  }

  p {
    text-wrap: initial;
    margin-block-start: 0;
  }

  oryx-cart-entries {
    max-height: 500px;
    overflow: scroll;
    display: block;
  }
`;
