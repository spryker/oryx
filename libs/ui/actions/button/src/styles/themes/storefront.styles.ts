import { ThemeData } from '@spryker-oryx/core';
import { css } from 'lit';

export const styles = [
  css`
    ::slotted(:is(button, a)) {
      border-color: green;
    }
  `,
];

export const theme: ThemeData = {
  styles,
};
