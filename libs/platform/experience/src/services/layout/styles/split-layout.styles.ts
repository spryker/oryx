import { css, unsafeCSS } from 'lit';
import { LayoutStyles } from '../layout.model';
import { gridSystem } from './grid-system.styles';

export const splitLayout = (
  type: 'equal' | 'main' | 'aside'
): LayoutStyles => ({
  styles: css`
    ${gridSystem}

    :host {
      --split: var(--oryx-column-split-${unsafeCSS(type)});

      grid-template-columns:
        calc(
          var(--split) * var(--_item-size) + (var(--split) - 1) *
            var(--column-gap, var(--oryx-gap-column, 0px))
        )
        auto;
    }
  `,
  sm: css`
    :host {
      grid-template-columns: auto;
    }
  `,
});

export const styles = splitLayout('equal');
