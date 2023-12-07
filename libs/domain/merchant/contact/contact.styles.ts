import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

export const merchantContactStyles = css`
  :host {
    display: grid;
    gap: 8px;
  }

  h3 {
    ${headingUtil(HeadingTag.H3)}
  }
`;
