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

  :host([no-methods]) {
    --oryx-icon-size: 40px;

    align-items: center;
  }

  :host([no-methods]) p {
    line-height: 22px;
    margin: 0;
  }

  div {
    display: flex;
  }

  oryx-radio {
    padding: var(--oryx-space-4);
  }

  oryx-site-price {
    font-weight: 600;
    font-size: 16px;
    margin-inline-start: auto;
  }
`;
