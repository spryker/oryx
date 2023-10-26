import { css, unsafeCSS } from 'lit';
import { LayoutStyles } from '../../../layout.model';
import { gridSystem } from '../../grid-system.styles';

export const splitLayout = (type: 'equal' | 'main' | 'aside'): LayoutStyles => {
  const cssVar = unsafeCSS(`var(--oryx-column-split-${type})`);
  return {
    styles: css`
      ${gridSystem}

      :host {
        --split: ${cssVar};

        grid-template-columns:
          calc(
            var(--split) * var(--_item-size) + (var(--split) - 1) *
              var(--column-gap, var(--oryx-column-gap, 0px))
          )
          auto;
      }
    `,
    sm: css`
      :host {
        grid-template-columns: auto;
      }
    `,
  };
};

export const styles = splitLayout('equal');
