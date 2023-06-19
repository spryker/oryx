import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const orderSummaryStyles = css`
  h2 {
    margin: 32px 0;
  }

  .details-container {
    display: flex;
    gap: 17px;
  }

  oryx-button {
    align-self: end;
  }

  oryx-button button {
    flex: initial;
  }

  section {
    gap: 8px;
    display: grid;
    grid-template-columns: max-content auto;
    flex: 1;
  }

  .summary {
    align-items: center;
  }

  section:first-of-type {
    grid-template-columns: 20px max-content auto;
    gap: 8px 6px;
  }

  .title {
    font-weight: 600;
  }

  h3 {
    margin-block-end: 4px;
  }

  hr,
  oryx-heading {
    grid-column: 1 / 3;
  }

  hr {
    border: none;
    border-block-start: 1px solid var(--oryx-color-neutral-4);
    margin: 20px 0;
    outline: none;
  }

  oryx-icon {
    color: var(--oryx-color-neutral-9);
  }
`;

const smallScreen = css`
  .details-container {
    flex-direction: column;
  }

  oryx-button {
    align-self: start;
  }
`;

export const screenStyles = screenCss({
  sm: smallScreen,
});
