import { css } from 'lit';
import { LayoutStyles } from '../../../../layout/src/layout.model';

export const styles: LayoutStyles = {
  styles: css`
    :host {
      --_bleed: calc((100vw - var(--_container-width)) / 2);

      scroll-padding-inline-start: var(--_bleed);
      padding-inline: var(--_bleed);
      margin-inline: 0;
    }
  `,
};
