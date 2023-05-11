import { css } from 'lit';
import { LayoutStyles } from '../layout.model';
import { gridSystem } from './grid-system.styles';

export const styles: LayoutStyles = {
  styles: css`
    ${gridSystem}

    :host {
      grid-template-columns: repeat(
        var(--oryx-column-grid, var(--oryx-column-base)),
        1fr
      );
    }
  `,
};
