import {
  inputComponent,
  selectComponent,
  spinnerComponent,
} from '@spryker-oryx/ui';
import { css } from 'lit';

const noTransitionField = css`
  :host([floatLabel]) slot[name='label'] {
    transition: none;
  }

  :host([floatLabel][has-prefix]:not([prefixicon='search']))
    slot[name='label'] {
    inset-inline-start: 75px;
    max-width: 170px;
  }

  :host([floatLabel][has-prefix]:not([prefixicon='search']):is(:focus-within, [has-value]))
    slot[name='label'] {
    inset-inline-start: 65px;
    max-width: 165px;
  }
`;

export const chromaticStyledComponents = [
  spinnerComponent({
    stylesheets: [
      ...(spinnerComponent().stylesheets ?? []),
      {
        rules: css`
          oryx-icon,
          ::slotted(oryx-icon) {
            animation-iteration-count: 0;
          }
        `,
      },
    ],
  }),
  inputComponent({
    stylesheets: [
      ...(inputComponent().stylesheets ?? []),
      {
        rules: noTransitionField,
      },
    ],
  }),
  selectComponent({
    stylesheets: [
      ...(selectComponent().stylesheets ?? []),
      {
        rules: noTransitionField,
      },
    ],
  }),
];
