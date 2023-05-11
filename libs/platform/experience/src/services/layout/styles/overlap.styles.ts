import { css } from 'lit';
import { LayoutStyles } from '../layout.model';

export const styles: LayoutStyles = {
  styles: css`
    :host([overlap]) {
      display: grid;
    }

    :host([overlap]) > *,
    :host([overlap]) ::slotted(*) {
      grid-row: 1;
      grid-column: 1;
    }
  `,
};
