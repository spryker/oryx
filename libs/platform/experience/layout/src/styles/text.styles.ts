import { css } from 'lit';
import { LayoutStyles } from '../layout.model';

export const styles: LayoutStyles = {
  styles: css`
    :host {
      display: block;
      column-count: var(--_text-column-count, var(--oryx-grid-text-items, 2));
    }

    :first-child,
    ::slotted(:first-child) {
      margin-top: 0;
    }
  `,
};
