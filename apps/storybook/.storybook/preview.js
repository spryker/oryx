// organize-imports-ignore
import './global.css';
import './app/build';
import MockDate from 'mockdate';

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

export const decorators = [
  (storyFn, context) => {
    //automatically reset mocked date for each story that does not use MockDateDecorator
    MockDate.reset();
    return storyFn(context);
  },
];
