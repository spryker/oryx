// organize-imports-ignore
import './global.css';
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
  chromatic: { delay: 1500 },
};
