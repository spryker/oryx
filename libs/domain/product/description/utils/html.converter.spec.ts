import { convertLineFeedsToHTML } from './html.converter';

describe('convertLineFeedsToHTML', () => {
  let text: string;
  describe('when the test contains a single line break', () => {
    beforeEach(() => {
      text = `foo
      bar`;
    });
    it(`should have 1 <br />`, () => {
      expect(convertLineFeedsToHTML(text)).toBe('<p>foo<br />bar</p>');
    });
  });

  describe('when the test contains two line breaks', () => {
    beforeEach(() => {
      text = `foo

    bar`;
    });
    it(`should have 2 <p>`, () => {
      expect(convertLineFeedsToHTML(text)).toBe('<p>foo</p><p>bar</p>');
    });
  });

  describe('when the test contains two line breaks', () => {
    beforeEach(() => {
      text = `foo

    bar
    test`;
    });
    it(`should have 2 <p> and 1 <br />`, () => {
      expect(convertLineFeedsToHTML(text)).toBe(
        '<p>foo</p><p>bar<br />test</p>'
      );
    });
  });
});
