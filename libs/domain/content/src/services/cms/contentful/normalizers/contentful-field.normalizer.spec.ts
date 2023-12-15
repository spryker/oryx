import {
  ContentfulContentField,
  contentfulFieldNormalizer,
} from './contentful-field.normalizer';

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
    const field: ContentfulContentField = {
      type: 'Text',
      key: 'my-key',
      value: '## My Heading\n\nMy paragraph.',
    };
    parse.mockReturnValue('parsed');
    const result = contentfulFieldNormalizer(field);
    expect(parse).toHaveBeenCalledWith(field.value);
    expect(result).toEqual({ ...field, value: 'parsed' });
  });

  it('should not normalize non-text field', () => {
    const field: ContentfulContentField = {
      type: 'Number',
      key: 'my-key',
      value: 123,
    };
    expect(contentfulFieldNormalizer(field)).toEqual(field);
  });
});
