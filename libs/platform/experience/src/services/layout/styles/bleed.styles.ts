import { css } from 'lit';
import { LayoutStyles } from '../layout.model';

export const styles: LayoutStyles = {
  styles: css`
    :host {
      --_bleed: calc((100% - var(--_container-width)) / 2);

      scroll-padding-inline-start: var(--_bleed);
      padding-inline: var(--_bleed) !important;
      margin-inline: 0;
    }

    :host oryx-composition {
      /* need this for flyout... */
      inset-inline-start: 0 !important;

      width: 100%;
    }
  `,
};
