import { css } from 'lit';
import { LayoutStyles } from '../../../layout.model';

export const styles: LayoutStyles = {
  styles: css`
    :host {
      --oryx-link-icon-size: 24px;
      --oryx-link-width: 100%;
      --oryx-link-color: currentColor;
      --oryx-link-decoration: none;

      display: flex;
    }

    oryx-content-link,
    ::slotted(oryx-content-link) {
      display: flex;
      flex-wrap: wrap;
      align-self: stretch;
    }
  `,
};

export const horizontalStyles = css`
  :host {
    --oryx-link-padding: 16px 0;

    align-items: var(--align, start);
    justify-content: var(--justify, start);
  }

  ::slotted(oryx-content-link:is([current], :hover, :focus-within)),
  oryx-content-link:is([current], :hover, :focus-within) {
    box-shadow: 0 -4 0 0 var(--oryx-color-primary-9) inset;
  }
`;

export const verticalStyles = css`
  :host {
    --oryx-link-padding: 8px 12px 8px 0;

    flex-direction: column;
  }

  oryx-content-link,
  ::slotted(oryx-content-link) {
    padding-inline-start: 12px;
  }

  oryx-content-link[current],
  ::slotted(oryx-content-link[current]) {
    box-shadow: 4px 0 0 0 var(--oryx-color-primary-9) inset;
  }

  oryx-content-link:hover,
  ::slotted(oryx-content-link:hover) {
    background-color: var(--oryx-color-neutral-3);
  }

  oryx-content-link:active,
  ::slotted(oryx-content-link:active) {
    background-color: var(--oryx-color-primary-5);
  }
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
