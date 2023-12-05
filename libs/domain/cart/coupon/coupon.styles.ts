import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

export const couponStyles = css`
  h3 {
    ${headingUtil(HeadingTag.H5, { margin: '0 0 8px' })};
  }

  section {
    display: grid;
    grid-template-columns: 1fr min-content;
    gap: 20px;
    align-items: start;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 10px 0 0;
    grid-column: 1;
  }

  li {
    display: grid;
    column-gap: 10px;
    align-items: center;
    grid-template-columns: max-content 1fr max-content;
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
`;