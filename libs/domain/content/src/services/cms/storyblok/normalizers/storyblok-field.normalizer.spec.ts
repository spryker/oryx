import {
  StoryblokContentField,
  storyblokFieldNormalizer,
} from './storyblok-field.normalizer';

const parse = vi.fn();

vi.mock('marked', () => ({
  marked: {
    parse: (d: string) => parse(d),
  },
}));

describe('storyblokFieldNormalizer', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should normalize text field', () => {
    const field: StoryblokContentField = {
      type: 'markdown',
      key: 'my-key',
      value: '## My Heading\n\nMy paragraph.',
    };
    parse.mockReturnValue('parsed');
    const result = storyblokFieldNormalizer(field);
    expect(parse).toHaveBeenCalledWith(field.value);
    expect(result).toEqual({ ...field, value: 'parsed' });
  });

  it('should not normalize non-text field', () => {
    const field: StoryblokContentField = {
      type: 'Number',
      key: 'my-key',
      value: 123,
    };
    expect(storyblokFieldNormalizer(field)).toEqual(field);
  });
});
