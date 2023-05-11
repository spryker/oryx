import { css } from 'lit';
import { LayoutStyles } from '../layout.model';

export const styles: LayoutStyles = {
  styles: css`
    :host {
      display: block;
      column-count: var(--oryx-column-grid, 2);
    }

    :first-child,
    ::slotted(:first-child) {
      margin-block-start: 0;
    }
  `,
};
