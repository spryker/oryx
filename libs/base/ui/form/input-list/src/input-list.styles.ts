import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { screenCss } from '@spryker-oryx/utilities';

import { css } from 'lit';

export const styles = css`
  fieldset {
    margin: 0;
    padding: 0;
    border: 0;
  }

  legend {
    ${headingUtil(HeadingTag.SubtitleSmall)}

    display: none;
    margin-block-end: 8px;
    text-transform: uppercase;
  }

  legend[hasHeading] {
    display: block;
  }

  .content {
    display: inline-flex;
    gap: 8px;
  }

  :host([direction='vertical']) .content {
    flex-direction: column;
    align-items: start;
  }

  [hasErrorContent] {
    margin-block-start: 1px;
    margin-inline-start: 1px;
  }
`;

export const screenStyles = screenCss({
  sm: css`
    legend {
      ${headingUtil(HeadingTag.Subtitle, '0 20px')}
    }

    .content {
      gap: 20px;
    }
  `,
});
