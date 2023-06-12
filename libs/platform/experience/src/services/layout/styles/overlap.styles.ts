import { css } from 'lit';
import { LayoutStyles } from '../layout.model';

export const styles: LayoutStyles = {
  styles: css`
    :host([oryx-layout-overlap]) {
      display: grid;
    }

    :host([oryx-layout-overlap]) > *,
    :host([oryx-layout-overlap]) ::slotted(*) {
      grid-row: 1;
      grid-column: 1;
    }
  `,
};
