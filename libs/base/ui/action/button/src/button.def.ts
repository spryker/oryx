import { componentDef } from '@spryker-oryx/utilities';
import { buttonScreenStyles } from './styles';

export const buttonComponent = componentDef({
  name: 'oryx-button',
  impl: () => import('./button.component').then((m) => m.ButtonComponent),
  stylesheets: [{ rules: buttonScreenStyles }],
});
