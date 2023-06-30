import { ThemeStylesheets } from '@spryker-oryx/experience';
import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

const cartDeliveryTotalRules = css`
  .calculation-message {
    ${headingUtil(HeadingTag.H6)};

    flex: 100%;
    color: var(--oryx-color-neutral-9);
  }

  .free {
    color: var(--oryx-color-highlight-10);
  }
`;

export const cartDeliveryTotalStyles: ThemeStylesheets = [
  cartDeliveryTotalRules,
];
