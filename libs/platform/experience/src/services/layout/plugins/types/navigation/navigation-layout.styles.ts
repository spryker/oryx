import { css } from 'lit';
import { LayoutStyles } from '../../../layout.model';

export const styles: LayoutStyles = {
  styles: css`
    :host {
      /* --oryx-link-icon-size: 24px;
      --oryx-link-width: 100%;
      --oryx-link-color: currentColor;
      --oryx-link-decoration: none; */

      display: flex;
    }

    /* oryx-content-link,
    ::slotted(oryx-content-link) {
      display: flex;
      flex-wrap: wrap;
      align-self: stretch;
    } */
  `,
};

export const horizontalStyles = css`
  :host {
    --oryx-link-decoration: none;

    /* --oryx-link-padding: 16px 0; */
    /* --_p: 16px 0; */

    /* --oryx-link-hover-shadow: 0 -4px 0 0 var(--oryx-color-primary-9) inset;
    --oryx-link-active-shadow: var(--oryx-link-hover-shadow);
    --oryx-link-current-shadow: var(--oryx-link-hover-shadow); */

    /* --oryx-action-shadow-hover: 0 -4px 0 0 var(--oryx-color-primary-9) inset;
    --oryx-action-shadow-active: var(--oryx-action-shadow-hover); */

    /* --oryx-link-underline-offset: 18px;
    --oryx-link-underline: underline 4px solid transparent; */

    /* align-items: var(--align, start);
    justify-content: var(--justify, start); */
  }
`;

export const verticalStyles = css`
  :host {
    /* --oryx-content-link-padding: 0 0 0 12px;
    --oryx-link-padding: 8px 12px 8px 0;
    --oryx-link-hover-background: var(--oryx-color-neutral-3);
    --oryx-link-active-background: var(--oryx-color-primary-5);
    --oryx-link-current-shadow: 4px 0 0 0 var(--oryx-color-primary-9) inset; */

    /* flex-direction: column; */

    --oryx-action-padding: 4px 0 4px 12px;
    --oryx-action-underline: none;
    --oryx-action-shadow: 4px 0 0 0 transparent inset;
    --oryx-action-shadow-hover: 4px 0 0 0 var(--oryx-color-primary-9) inset;

    display: grid;
  }
`;
