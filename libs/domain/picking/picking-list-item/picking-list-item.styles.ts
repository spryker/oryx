import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

export const pickingListItemComponentStyles = css`
  oryx-heading {
    justify-content: space-between;
    align-items: center;
    display: flex;
    width: 100%;
  }

  h3 {
    ${headingUtil(HeadingTag.H3)}
  }

  span.identifier {
    ${headingUtil(HeadingTag.H6)}

    color: var(--oryx-color-neutral-darker);
    margin-inline-start: auto;
  }

  ::part(body) {
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 0.005em;
    display: flex;
    justify-content: space-between;
    min-height: 38px;
  }

  .total {
    color: var(--oryx-color-neutral-darker);
    display: flex;
    align-items: center;
    gap: 8px;
    height: 24px;
    width: 100%;
  }

  .show-customer {
    margin-inline-start: auto;
  }

  .start-picking {
    margin-block: 0;
    width: 100%;
  }
`;
