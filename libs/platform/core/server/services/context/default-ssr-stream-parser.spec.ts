import { DefaultSSRStreamParserService } from './default-ssr-stream-parser';

describe('DefaultSSRStreamParserService', () => {
  const parser = new DefaultSSRStreamParserService();

  it('should parse html stream and return stack of data attributes of the opened tags', () => {
    const aTemplate = `
      <test>
        <input data-test />
        <test data-test="4">
          <   test data-test="3"></test>
          <test data-test="2"></test>
            <    test data-inner="1"> <hello
    `;
    const bTemplate = `
      hydratable="click" data-test="5"> <test2
    `;
    const cTemplate = `
      hydratable="click">
    `;
    const dTemplate = `
      </test2><    /hello>
    `;
    const eTemplate = `
      </test>
        </test>
    `;
    parser.fillStream(aTemplate);
    expect(parser.getStreamStack()).toEqual([{ test: '4' }, { inner: '1' }]);
    parser.fillStream(bTemplate);
    expect(parser.getStreamStack()).toEqual([
      { test: '4' },
      { inner: '1' },
      { test: '5' },
    ]);
    parser.fillStream(cTemplate);
    expect(parser.getStreamStack()).toEqual([
      { test: '4' },
      { inner: '1' },
      { test: '5' },
    ]);
    parser.fillStream(dTemplate);
    expect(parser.getStreamStack()).toEqual([{ test: '4' }, { inner: '1' }]);
    parser.fillStream(eTemplate);
    expect(parser.getStreamStack()).toEqual([]);
  });
});
