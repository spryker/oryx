import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

export const styles = css`
  :host {
    --oryx-tile-padding: 0;

    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  h3 {
    ${headingUtil(HeadingTag.H5)}
  }

  form {
    display: contents;
  }

  .no-methods {
    text-align: center;
    line-height: 22px;
  }

  oryx-radio {
    padding: var(--oryx-space-4);
  }

  small {
    font-weight: 600;
    color: var(--oryx-color-neutral-8);
  }
`;
