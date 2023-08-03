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

    //automatically un-apply width and height from iframe element that added by OverlaysDecorator
    const iframe = window.frameElement ?? window.parent;
    if (iframe.classList.has('chromatic-overlay-decorated')) {
      iframe.classList.remove('chromatic-overlay-decorated');
      iframe.style.width = '';
      iframe.style.height = '';
    }

    return storyFn(context);
  },
];
