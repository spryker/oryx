import {
  StrapiContentField,
  strapiFieldNormalizer,
} from './strapi-field.normalizer';

const parse = vi.fn();

vi.mock('marked', () => ({
  marked: {
    parse: (d: string) => parse(d),
  },
}));

describe('contentfulFieldNormalizer', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should normalize text field', () => {
    const field: StrapiContentField = {
      type: 'markdown',
      key: 'my-key',
      value: '## My Heading\n\nMy paragraph.',
    };
    parse.mockReturnValue('parsed');
    const result = strapiFieldNormalizer(field);
    expect(parse).toHaveBeenCalledWith(field.value);
    expect(result).toEqual({ ...field, value: 'parsed' });
  });

  it('should not normalize non-text field', () => {
    const field: StrapiContentField = {
      type: 'Number',
      key: 'my-key',
      value: 123,
    };
    expect(strapiFieldNormalizer(field)).toEqual(field);
  });
});
