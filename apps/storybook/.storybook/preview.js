// organize-imports-ignore
import '!style-loader!css-loader!../../../libs/ui/public/styles/oryx-theme.css';
import './font.css';
import './app/build';

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
