import { css } from 'lit';
import { LayoutStyles } from '../layout.model';

export const styles: LayoutStyles = {
  base: css`
    :host {
      --oryx-grid-columns: var(--oryx-grid-columns-base);
      --_col1: calc(var(--oryx-grid-columns) * var(--split-column-factor, 0.5));
      --_split-col: calc(
        (var(--_col1) * (var(--_item-size) + var(--oryx-grid-gap-column, 0px))) -
          var(--oryx-grid-gap-column, 0px)
      );

      grid-template-columns: var(--_split-col) auto;
    }
  `,
  sm: {
    base: css`
      :host {
        grid-template-columns: auto;
      }
    `,
  },
};
