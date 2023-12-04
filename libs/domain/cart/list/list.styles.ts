import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

export const cartListStyles = css`
  :host {
    display: grid;
    gap: 10px;
  }

  section {
    display: flex;
    justify-content: space-between;
  }

  h1 {
    ${headingUtil(HeadingTag.H3)}
  }

  p {
    text-wrap: initial;
    margin-block-start: 0;
  }
`;
