import { css } from 'lit';
import { LayoutStyles } from '../../../layout.model';

export const styles: LayoutStyles = {
  styles: css`
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
  `,
};

export const horizontalStyles = css`
  :host {
    --oryx-link-padding: 16px 0;
    --oryx-link-hover-shadow: 0 -4px 0 0 var(--oryx-color-primary-9) inset;
    --oryx-link-active-shadow: var(--oryx-link-hover-shadow);
    --oryx-link-current-shadow: var(--oryx-link-hover-shadow);

    align-items: var(--align, start);
    justify-content: var(--justify, start);
  }
`;

export const verticalStyles = css`
  :host {
    --oryx-content-link-padding: 0 0 0 12px;
    --oryx-link-padding: 8px 12px 8px 0;
    --oryx-link-hover-background: var(--oryx-color-neutral-3);
    --oryx-link-active-background: var(--oryx-color-primary-5);
    --oryx-link-current-shadow: 4px 0 0 0 var(--oryx-color-primary-9) inset;

    flex-direction: column;
  }
`;

export const dropdownStyles = css`
  :host {
    --oryx-popover-border-radius: 0;
  }

  oryx-composition {
    --oryx-content-link-padding: 0 0 0 12px;
    --oryx-link-padding: 8px 12px 8px 0;
    --oryx-link-hover-background: var(--oryx-color-neutral-3);
    --oryx-link-active-background: var(--oryx-color-primary-5);
    --oryx-link-hover-shadow: none;
    --oryx-link-active-shadow: none;
    --oryx-link-current-shadow: none;
    --oryx-link-current-color: var(--oryx-color-primary-9);

    display: contents;
  }
`;
