import { css } from 'lit';
import { LayoutStyles } from '../layout.model';

export const styles: LayoutStyles = {
  styles: css`
    :host([layout-overlap]) {
      display: grid;
    }

    :host([layout-overlap]) > *,
    :host([layout-overlap]) ::slotted(*) {
      grid-row: 1;
      grid-column: 1;
    }
  `,
};
