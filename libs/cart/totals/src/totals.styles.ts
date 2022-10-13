import { css } from 'lit';

export const styles = css`
  :host {
    --oryx-icon-size-small: 15px;

    background-color: var(--oryx-color-neutral-lightest);
    border-radius: var(--oryx-border-radius-small);
    font-size: var(--oryx-font-size-medium);
    line-height: 1.5;
  }

  h4 {
    padding-top: var(--oryx-space-4);
  }

  :host > * {
    padding-inline: var(--oryx-space-4);
  }

  :host > dl:last-child {
    margin-top: var(--oryx-space-2);
    padding-top: var(--oryx-space-3);
    padding-bottom: var(--oryx-space-4);
    border-top: solid 1px var(--oryx-color-neutral-light);
    font-weight: 600;
  }

  :host > dl:last-child dd {
    font-size: var(--oryx-font-size-large);
  }

  small {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--oryx-color-neutral);
  }

  small.tax-message {
    font-size: var(--oryx-font-size-medium);
    font-weight: 500;
    display: block;
  }

  h4,
  dl,
  dt,
  dd,
  p {
    margin: 0;
  }

  dl {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: var(--oryx-space-2);
  }

  dd {
    justify-self: end;
    text-align: end;
  }

  [slot='aside'],
  oryx-collapsible dd {
    color: var(--oryx-color-highlight);
  }

  dl,
  oryx-collapsible {
    margin-top: var(--oryx-space-4);
  }

  oryx-collapsible :is(dt, dd) {
    font-size: 1rem;
  }

  oryx-collapsible dl {
    margin-top: var(--oryx-space-2);
  }
`;
