import { css } from 'lit';
import { LayoutStyles } from '../layout.model';
import { gridSystem } from './grid-system.styles';

export const styles: LayoutStyles = {
  styles: css`
    ${gridSystem}

    :host {
      --oryx-grid-columns: var(--oryx-grid-columns-base);
      --_col1: calc(var(--oryx-grid-columns) * var(--split-column-factor, 0.5));
      --_split-col: calc(
        (var(--_col1) * (var(--_item-size) + var(--column-gap, 0px))) -
          var(--column-gap, 0px)
      );

      grid-template-columns: var(--_split-col) auto;
    }
  `,
  sm: css`
    :host {
      grid-template-columns: auto;
    }
  `,
};
