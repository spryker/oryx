import { css } from 'lit';

export const dropdownStyles = css`
  :host {
    --oryx-link-icon-size: 24px;
    --oryx-link-width: 100%;
    --oryx-link-color: currentColor;
    --oryx-link-decoration: none;

    display: flex;
  }

  oryx-content-link,
  ::slotted(oryx-content-link) {
    display: flex;
    flex-wrap: wrap;
    align-self: stretch;
  }

  :host {
    --oryx-popover-border-radius: 0;
    --oryx-content-link-padding: 0 0 0 12px;
    --oryx-link-padding: 8px 12px 8px 0;
    --oryx-link-hover-background: var(--oryx-color-neutral-3);
    --oryx-link-active-background: var(--oryx-color-primary-5);
    --oryx-link-hover-shadow: none;
    --oryx-link-active-shadow: none;
    --oryx-link-current-shadow: none;
    --oryx-link-current-color: var(--oryx-color-primary-9);
  }
`;
