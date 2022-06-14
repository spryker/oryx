import {
  AbstractProduct,
  Resource,
  Suggestion,
  SuggestionQualifier,
} from '../../models';

const dummyUrl = (): string => `${window.location.href}#`;
const makeTheNameGreatAgain = (name: string): string =>
  name
    .split(' ')
    .map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1)}`)
    .join(' ');

const createResources = (
  completion: string[],
  resourceName: string
): Resource[] => {
  return completion.map((c) => ({
    name: `${makeTheNameGreatAgain(c)} ${resourceName}`,
    url: dummyUrl(),
  }));
};

const createProducts = (completion: string[]): AbstractProduct[] => {
  return completion.map((c, i) => ({
    //TODO: offered price based on presenting 'offer' word in completion name
    //offeredPrice: ...
    price: 1999,
    abstractName: `${makeTheNameGreatAgain(c)}`,
    abstractSku: String(i),
    url: dummyUrl(),
    images: [
      {
        externalUrlSmall:
          'https://images.icecat.biz/img/gallery_mediums/29801891_9454.jpg',
        externalUrlLarge:
          'https://images.icecat.biz/img/gallery/29801891_9454.jpg',
      },
    ],
  }));
};

export const createSuggestionMock = (
  { query }: SuggestionQualifier,
  _completions: string[]
): Suggestion => {
  const re = new RegExp(`^${query}.*`, 'i');
  const completion = _completions.filter((c) => c.match(re));

  return {
    completion,
    categories: createResources(completion, 'Category'),
    cmsPages: createResources(completion, 'Pages'),
    abstractProducts: createProducts(completion),
  };
};
