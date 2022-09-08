import { ThemeData } from '@spryker-oryx/core';

const styles = `
::slotted(:is(button, a)) {
  background: red;
}
`;

export const theme: ThemeData = {
  styles,
};
