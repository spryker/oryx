import { css } from 'lit';
import { LayoutStyles } from '../layout.model';

export const styles: LayoutStyles = {
  base: css`
    :host {
      --_bleed: calc((100vw - var(--_container-width)) / 2);

      scroll-padding-inline-start: var(--_bleed);
    }
  `,
  styles: css`
    :host([bleed]) {
      padding-inline: var(--_bleed);
      margin-inline: 0;
    }
  `,
  lg: {
    styles: css`
      :host([bleed-lg]) {
        padding-inline: var(--_bleed);
        margin-inline: 0;
      }
    `,
  },
  md: {
    styles: css`
      :host([bleed-md]) {
        padding-inline: var(--_bleed);
        margin-inline: 0;
      }
    `,
  },
  sm: {
    styles: css`
      :host([bleed-sm]) {
        padding-inline: var(--_bleed);
        margin-inline: 0;
      }
    `,
  },
};
