import { componentSchema, componentSchemaKey } from './component-schema';

@componentSchema({
  name: 'name',
  group: 'group',
  category: 'category',
})
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
      (MockModelA as unknown as { [componentSchemaKey]: unknown })[
        componentSchemaKey
      ]
    ).toEqual({
      name: 'name',
      group: 'group',
      category: 'category',
      options: [
        { id: 'sku', title: 'a', type: 'b' },
        { id: 'product', label: 'c', placeholder: 'd' },
      ],
    });
  });
});
