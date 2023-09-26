import { css } from 'lit';
import { LayoutStyles } from '../layout.model';
export const styles: LayoutStyles = {
  styles: css`
    :host {
      margin-inline: initial; /* reverted from base layout */
      /* reverted from base layout */
      width: initial;
      /* background-color: red; */
      /* outline: solid 4px yellow; */
    }

    oryx-composition {
      grid-template-columns: 1fr;

      position: absolute;
      transition: all 0.3s ease-in-out 0.1s;
      /* width: 200px; */
      /** depends on outer bleed, move it up! */
      /* inset-inline-start: var(--_bleed); */
      z-index: 100;

      /* padding: 10px; */
      /* box-sizing: border-box; */
    }
    a oryx-composition,
    :host([nested]) {
      padding-block: var(--oryx-navigation-padding, 10px);
      background-color: lightcyan;
    }
  `,
};
