import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const searchBoxStyles = css`
  :host {
    --oryx-popover-maxheight: 526px;
    --oryx-icon-size: 16px;
    --oryx-popover-vertical-offset: 10px;
  }

  [slot='option'] {
    display: grid;
    grid-template-columns: 177px 1fr;
    gap: 20px;
  }

  section {
    --oryx-icon-size: 24px;

    display: flex;
    flex-direction: column;
    padding: 15px;
  }

  section:first-child {
    gap: 15px;
  }

  h5 {
    ${headingUtil(HeadingTag.Subtitle)}
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  h5:not(:first-child) {
    margin-block-start: 5px;
  }

  section > oryx-content-link {
    color: var(--oryx-color-neutral-9);
    padding-inline-start: 8px;
  }

  oryx-product-card:not(:last-of-type) {
    border-block-end: 2px var(--oryx-color-divider, var(--oryx-color-neutral-6))
      solid;
  }

  oryx-button {
    align-self: center;
  }
`;

const smallScreen = css``;
export const screenStyles = screenCss({
  sm: smallScreen,
});
