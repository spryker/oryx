import { css } from 'lit';
import { LayoutStyles } from '../../../layout.model';

export const styles: LayoutStyles = {
  styles: css`
    :host {
      display: flex;
    }

    oryx-content-link {
      display: block;
    }

    oryx-content-link::part(anchor) {
      width: 100%;
      text-decoration: none;
    }
  `,
};

export const horizontalStyles = css`
  :host {
    align-items: var(--align, start);
    justify-content: var(--justify, start);
  }

  oryx-content-link {
    display: flex;
    flex-wrap: wrap;
    align-self: stretch;
  }

  oryx-content-link::part(anchor) {
    padding-block: 16px;
  }

  oryx-content-link:hover,
  oryx-content-link:focus-visible {
    color: var(--oryx-color-primary-9);
  }

  oryx-content-link::after {
    content: '';
    margin-block-start: -4px;
    display: block;
    height: 4px;
    transition: background-color 0.3s ease-in-out;
    flex: 100%;
    align-self: end;
  }

  oryx-content-link:focus-within::after,
  oryx-content-link:hover::after {
    background-color: var(--oryx-color-primary-9);
    transition-delay: 0;
  }
`;

export const verticalStyles = css`
  /** tslint:disable-next-line  */
`;

export const flyoutStyles = css`
  :host {
    margin-inline: initial; /* reverted from base layout */
    width: initial; /* reverted from base layout */
  }

  :host(:not(:hover)) oryx-composition {
    opacity: 0;
    pointer-events: none;
  }

  oryx-composition {
    position: absolute;
    transition: all 0.3s ease-in-out 0.1s;
    width: min(100%, calc(var(--_container-width)));
    inset-inline-start: var(--_bleed);
    z-index: 100;
  }
`;
