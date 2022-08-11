import { removeElement } from '@spryker-oryx/testing';
import { addLink } from './add-link';

describe('addLink', () => {
  const selector = 'head link[href="my-path/path.css"][rel="stylesheet"]';
  const getLinkEl = (): Element | null => document.querySelector(selector);

  afterEach(() => {
    removeElement('head link[href="my-path/path.css"][rel="stylesheet"]');
  });

  it('should attach the link to the dom properly', () => {
    addLink('my-path/path.css');

    expect(selector).toBeInTheDocument();
  });

  describe('if there are extra attributes', () => {
    beforeEach(() => {
      addLink('my-path/path.css', {
        'data-type': 'my data',
      });
    });

    it('should add them to the element', () => {
      expect(getLinkEl()?.getAttribute('data-type')).toBe('my data');
    });
  });
});
