import { componentSchema, modelKey } from './component-schema';

class MockModelA {
  @componentSchema({
    title: 'a',
    type: 'b',
  })
  sku?: string;

  @componentSchema({
    label: 'c',
    placeholder: 'd',
  })
  product?: string;
}

describe('componentSchema decorator', () => {
  it('should assign model as static property', () => {
    expect(
      (MockModelA as unknown as { [modelKey]: unknown })[modelKey]
    ).toEqual([
      { id: 'sku', title: 'a', type: 'b' },
      { id: 'product', label: 'c', placeholder: 'd' },
    ]);
  });
});
