import { css } from 'lit';
import { LayoutStyles } from '../../../layout.model';

export const styles: LayoutStyles = {
  styles: css`
    :host {
      box-shadow: var(--oryx-shadow-direction, 0 4px) 8px 0 rgba(0 0 0 / 10%);
      z-index: var(--oryx-z-index, 1);
      isolation: isolate;
    }
  `,
};
