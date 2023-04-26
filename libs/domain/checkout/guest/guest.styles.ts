import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

export const styles = css`
  h1,
  p.have-an-account {
    ${headingUtil(HeadingTag.H5)};
  }

  p.have-an-account {
    margin-block-end: 20px;
  }

  /* tmp till new layout system is in */
  oryx-button {
    display: inline-block;
  }
`;
