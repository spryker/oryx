import { css } from 'lit';
import { LayoutStyles } from '../../../../layout/src/layout.model';

export const styles: LayoutStyles = {
  styles: css`
    :host {
      display: block;
      column-count: var(--_text-column-count, var(--oryx-grid-text-items, 2));
    }

    :first-child,
    ::slotted(:first-child) {
      margin-block-start: 0;
    }
  `,
};
