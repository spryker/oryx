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
        (var(--_col1) * (var(--_item-size) + var(--oryx-grid-gap-column, 0px))) -
          var(--oryx-grid-gap-column, 0px)
      );

      grid-template-columns: var(--_split-col) auto;
    }

    *:nth-child(odd),
    ::slotted(*:nth-child(odd)) {
      --oryx-grid-columns-base: var(--_col1);
    }

    *:nth-child(even),
    ::slotted(*:nth-child(even)) {
      --oryx-grid-columns-base: calc(
        var(--oryx-grid-columns-base) - var(--_col1)
      );
    }
  `,
  sm: css`
    :host {
      grid-template-columns: auto;
    }
  `,
};
