import { css } from 'lit';
import { LayoutStyles } from '../../../layout.model';

export const styles: LayoutStyles = {
  styles: css`
    :host {
      display: grid;
    }

    :host > *,
    :host ::slotted(*) {
      grid-row: 1;
      grid-column: 1;
    }
  `,
};
