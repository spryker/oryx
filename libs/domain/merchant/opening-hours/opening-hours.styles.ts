import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

export const openingHoursStyles = css`
  h3 {
    ${headingUtil(HeadingTag.H3)}
  }

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    display: grid;
    grid-template-columns: 1fr auto;
  }

  li div {
    grid-column: 2;
  }
`;
