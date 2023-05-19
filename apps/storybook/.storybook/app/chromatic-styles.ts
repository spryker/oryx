import {
  buttonComponent,
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
  buttonComponent({
    stylesheets: [
      ...(buttonComponent().stylesheets ?? []),
      {
        rules: css`
          :host([loading]) ::slotted(*)::before {
            background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2317b497"%3E%3Cg%3E%3Cellipse opacity="0.7" rx="3.48584" ry="3.4859" transform="matrix(0.80444 0.594034 -0.593986 0.804475 11.925 4.87503)" /%3E%3Cellipse rx="3.48584" ry="3.4859" transform="matrix(0.80444 0.594034 -0.593986 0.804475 20.1242 10.9278)" /%3E%3Cellipse opacity="0.4" rx="3.48584" ry="3.4859" transform="matrix(0.80444 0.594034 -0.593986 0.804475 5.87224 13.0723)" /%3E%3Cellipse opacity="0.3" rx="3.48584" ry="3.4859" transform="matrix(0.80444 0.594034 -0.593986 0.804475 14.0695 19.125)" /%3E%3C/g%3E%3C/svg%3E');
          }
          :host([type='critical'][loading]) ::slotted(*)::before {
            background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red"%3E%3Cg%3E%3Cellipse opacity="0.7" rx="3.48584" ry="3.4859" transform="matrix(0.80444 0.594034 -0.593986 0.804475 11.925 4.87503)" /%3E%3Cellipse rx="3.48584" ry="3.4859" transform="matrix(0.80444 0.594034 -0.593986 0.804475 20.1242 10.9278)" /%3E%3Cellipse opacity="0.4" rx="3.48584" ry="3.4859" transform="matrix(0.80444 0.594034 -0.593986 0.804475 5.87224 13.0723)" /%3E%3Cellipse opacity="0.3" rx="3.48584" ry="3.4859" transform="matrix(0.80444 0.594034 -0.593986 0.804475 14.0695 19.125)" /%3E%3C/g%3E%3C/svg%3E');
          }
        `,
      },
    ],
  }),
];
