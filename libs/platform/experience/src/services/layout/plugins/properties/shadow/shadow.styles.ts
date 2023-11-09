import { css } from 'lit';
import { LayoutStyles } from '../../../layout.model';

export const styles: LayoutStyles = {
  styles: css`
    :host {
      box-shadow: var(--oryx-shadow-direction, 0px 4px) 8px 0px
        rgba(0, 0, 0, 0.1);
      z-index: var(--oryx-z-index, 1);
      isolation: isolate;
    }
  `,
};
