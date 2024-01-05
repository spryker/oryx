import { css } from 'lit';
import { LayoutStyles } from '../../../layout.model';

export const styles: LayoutStyles = {
  styles: css`
    :host {
      --oryx-popover-border-radius: 0;

      display: contents;
    }

    oryx-composition[bucket='label'] {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    oryx-composition:not([slot]) {
      --oryx-link-padding: 8px 12px 8px 0;
      --oryx-content-link-padding: 0 0 0 12px;
      --oryx-link-hover-background: var(--oryx-color-neutral-3);
      --oryx-link-active-background: var(--oryx-color-primary-5);
      --oryx-link-hover-shadow: none;
      --oryx-link-active-shadow: none;
      --oryx-link-current-shadow: none;
      --oryx-link-current-color: var(--oryx-color-primary-9);
    }
  `,
};
