import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

export const checkoutHeaderStyles = css`
  :host {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding-block-end: 7px;
    margin-block-end: 20px;
    border-block-end: solid 2px
      var(--oryx-color-divider, var(--oryx-color-neutral-6));
  }

  ::slotted(h1),
  ::slotted(h2) {
    ${headingUtil(HeadingTag.H3)};
  }

  ::slotted(h3) {
    ${headingUtil(HeadingTag.H5)};
  }
`;
