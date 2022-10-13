import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
  }

  content-link::part(link) {
    margin-inline-start: -8px;
    padding-block: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
  }

  h1 oryx-text {
    --oryx-line-height: var(--oryx-line-height-h1);
  }

  h2 oryx-text {
    --oryx-line-height: var(--oryx-line-height-h2);
  }

  h3 oryx-text {
    --oryx-line-height: var(--oryx-line-height-h3);
  }

  h4 oryx-text {
    --oryx-line-height: var(--oryx-line-height-h4);
  }

  h5 oryx-text {
    --oryx-line-height: var(--oryx-line-height-h5);
  }

  h6 oryx-text {
    --oryx-line-height: var(--oryx-line-height-h6);
  }
`;
