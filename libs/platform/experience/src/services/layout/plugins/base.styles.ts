import { featureVersion } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const pre1_4_styles = css`
  :host {
    --_container-width: min(
      var(--oryx-container-width),
      calc(100vw - (2 * var(--oryx-container-bleed, 0px)))
    );

    display: grid;
    column-gap: var(--column-gap, var(--oryx-column-gap, 0));
    row-gap: var(--row-gap, var(--oryx-row-gap));
    margin-inline: auto;
    gap: var(--row-gap, var(--oryx-row-gap))
      var(--column-gap, var(--oryx-column-gap, 0));
    width: min(100%, calc(var(--_container-width)));
  }

  *,
  ::slotted(*) {
    transition: all var(--oryx-transition-time);
  }
`;

export const v1_4_styles = css`
  :host {
    margin-inline: auto;
    gap: var(--row-gap, var(--oryx-row-gap))
      var(--column-gap, var(--oryx-column-gap, 0));
    width: min(100%, calc(var(--_container-width)));
  }
`;

export const styles = featureVersion >= '1.4' ? v1_4_styles : pre1_4_styles;
