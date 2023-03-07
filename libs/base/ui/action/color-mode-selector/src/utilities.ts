import { rootInjectable } from '@spryker-oryx/utilities';

export interface ModeEvent {
  old: string;
  mode: string;
}

export const toggleMode = ({ old, mode }: ModeEvent): void => {
  const root = document.querySelector(rootInjectable.get());
  root?.removeAttribute(old);
  root?.setAttribute(mode, '');
};
