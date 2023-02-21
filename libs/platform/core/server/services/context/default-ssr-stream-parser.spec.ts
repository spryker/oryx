import { DefaultSSRStreamParserService } from './default-ssr-stream-parser';

describe('DefaultSSRStreamParserService', () => {
  const parser = new DefaultSSRStreamParserService();

  it('should parse html stream and return stack of data attributes of the opened tags', () => {
    const template = `
      <test>
        <input data-test />
        <test data-test="4">
          <   test data-test="3"></test>
          <test data-test="2"></test>
            <    test data-inner="1">
    `;
    const expected = [{ test: '"4"' }, { inner: '"1"' }];

    parser.fillStream(template);

    const stack = parser.getStreamStack();

    expect(stack).toEqual(expected);
  });
});
