import {
  baseStyles as typeaheadBaseStyles,
  screenStyles as typeaheadScreenStyles,
} from '@spryker-oryx/ui/typeahead';
import { css } from 'lit';
import { selectFilterStyles } from './select-filter.styles';
import { selectFloatingLabelStyles } from './select-floating-label.styles';

export const selectStyles = css`
  :host {
    cursor: pointer;
  }

  slot::slotted(select),
  slot::slotted(input:not([readonly])) {
    cursor: pointer;
    background-color: transparent;
  }

  ::slotted(input),
  input {
    cursor: inherit;
  }

  ::slotted(select) {
    width: 100%;
    height: 38px;
    padding: 7px 11px;
    background-color: transparent;
    border: none;
    outline: none;
    color: var(--oryx-color-neutral-12);
    pointer-events: none;
    font: inherit;
    text-overflow: ellipsis;
    appearance: none;
    /* stylelint-disable */
    /* requires by safari < 15.4 */
    -webkit-appearance: none;
    /* stylelint-enable */
  }

  oryx-icon[type='dropdown'] {
    --oryx-icon-size: var(--oryx-icon-size-md);
  }

  ::slotted(select:invalid),
  :host(:not([has-value])) ::slotted(select) {
    color: var(--oryx-color-placeholder);
  }
`;

export const baseStyles = [
  selectStyles,
  selectFilterStyles,
  typeaheadBaseStyles,
  selectFloatingLabelStyles,
];

export const screenStyles = [...typeaheadScreenStyles];
