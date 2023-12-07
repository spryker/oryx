import { featureVersion } from '@spryker-oryx/utilities';
import { css } from 'lit';
import { LayoutStyles } from '../../../layout.model';
import { gridSystem } from '../../grid-system.styles';

const v1_0_styles = css`
  ${gridSystem}

  :host {
    --oryx-column-count: var(--oryx-column-grid);

    grid-auto-flow: column;
    overflow: auto hidden;
    overscroll-behavior-x: contain;
    scroll-snap-type: both mandatory;
    grid-auto-columns: var(--_item-size);
    scroll-behavior: smooth;
  }

  :host::-webkit-scrollbar {
    display: none;
  }

  *,
  ::slotted(*) {
    scroll-snap-align: start;
  }
`;

const v1_2_styles = css`
  ${gridSystem}

  :host {
    --oryx-column-count: var(--oryx-column-grid);

    grid-auto-flow: column;
    overflow: var(--_scroll, auto) hidden;
    overscroll-behavior-x: contain;
    scroll-snap-type: both mandatory;
    grid-auto-columns: var(--_item-size);
    scrollbar-width: none;
  }

  :host::-webkit-scrollbar {
    display: none;
  }

  @media (hover: hover) {
    :host {
      --_scroll: var(--scroll-with-mouse);
    }
  }

  @media (hover: none) {
    :host {
      --_scroll: var(--scroll-with-touch);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :host {
      scroll-behavior: auto;
    }
  }

  *,
  ::slotted(*) {
    scroll-snap-align: start;
  }
`;

export const styles: LayoutStyles = {
  styles: featureVersion >= '1.2' ? v1_2_styles : v1_0_styles,
};

export const verticalStyles: LayoutStyles = {
  styles: css`
    :host {
      display: inline-grid;
      width: auto;
      grid-auto-flow: row;
      overflow: hidden auto;
      scroll-snap-type: y mandatory;
      grid-auto-columns: initial;
    }
  `,
};
