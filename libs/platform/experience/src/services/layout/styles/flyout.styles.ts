import { css } from 'lit';
import { LayoutStyles } from '../layout.model';

export const styles: LayoutStyles = {
  styles: css`
    :host {
      margin-inline: initial; /* reverted from base layout */
      width: initial; /* reverted from base layout */
    }

    oryx-composition {
      position: absolute;
      transition: all 0.3s ease-in-out 0.1s;
      width: min(100%, calc(var(--_container-width)));
      /** depends on outer bleed, move it up! */
      inset-inline-start: var(--_bleed);
      z-index: 100;
      /* padding: var(--oryx-navigation-padding, 10px); */
    }
  `,
};
