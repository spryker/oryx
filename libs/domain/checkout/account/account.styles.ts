import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

export const checkoutAccountStyles = css`
  p {
    margin-block: 10px 0;
  }

  p.have-an-account {
    ${headingUtil(HeadingTag.H5)};

    margin-inline: auto 10px;
  }
`;
