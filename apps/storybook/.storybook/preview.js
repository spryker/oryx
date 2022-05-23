import '!style-loader!css-loader!../../../libs/ui/public/styles/oryx-theme.css';
import { initializeRTL } from 'storybook-addon-rtl';
import './font.css';

initializeRTL();

export const parameters = {
  options: {
    storySort: {
      includeName: true,
      order: [
        'UI',
        ['Actions', ['Button', ['Static', ['Primary', 'Secondary']]]],
        '*',
      ],
      method: 'alphabetical',
    },
  },
};
