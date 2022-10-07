import { Theme } from '@spryker-oryx/core';
import isChromatic from 'chromatic/isChromatic';
import { css } from 'lit';

const noTransitionField = css`
  :host([floatLabel]) slot[name='label'] {
    transition: none;
  }

  :host([floatLabel][has-prefix]:not([prefixicon='search']))
    slot[name='label'] {
    inset-inline-start: 75px;
  }

  :host([floatLabel][has-prefix]:not([prefixicon='search']):is(:focus-within, [has-value]))
    slot[name='label'] {
    inset-inline-start: 65px;
  }
`;

export const chromaticTheme: Theme = isChromatic()
  ? {
      components: {
        'oryx-spinner': {
          styles: [
            css`
              oryx-icon,
              ::slotted(oryx-icon) {
                animation-iteration-count: 0;
              }
            `,
          ],
        },
        'oryx-input': {
          styles: [noTransitionField],
        },
        'oryx-select': {
          styles: [noTransitionField],
        },
      },
    }
  : { components: {} };
