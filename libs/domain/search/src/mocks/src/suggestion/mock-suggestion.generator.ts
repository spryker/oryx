import { Product } from '@spryker-oryx/product';
import { RouteType } from '@spryker-oryx/router';
import {
  Suggestion,
  SuggestionField,
  SuggestionQualifier,
  SuggestionResource,
} from '@spryker-oryx/search';

const dummyUrl = (): string => '#';
const makeTheNameGreatAgain = (name: string): string =>
  name
    .split(' ')
    .map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1)}`)
    .join(' ');

const createResources = (
  completion: string[],
  resourceName: string,
  type: RouteType
): SuggestionResource[] => {
  return completion.map((c) => ({
    name: `${makeTheNameGreatAgain(c)} ${resourceName}`,
    url: dummyUrl(),
    type,
  }));
};

const createProducts = (completion: string[]): Product[] => {
  return completion.map((c, i) => ({
    price: {
      defaultPrice: {
        value: 1999,
        currency: 'EUR',
        isNet: false,
      },
      ...(i % 2
        ? {
            originalPrice: {
              value: 2000,
              currency: 'EUR',
              isNet: false,
            },
          }
        : {}),
    },
    name: `${makeTheNameGreatAgain(c)}`,
    description: 'test',
    sku: String(i),
    images: [
      {
        sm: 'https://images.icecat.biz/img/gallery_mediums/29801891_9454.jpg',
        lg: 'https://images.icecat.biz/img/gallery/29801891_9454.jpg',
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
    [SuggestionField.Suggestions]: completion.map((name) => ({
      name,
      params: { q: name },
      type: RouteType.ProductList,
    })),
    [SuggestionField.Categories]: createResources(
      completion,
      'Category',
      RouteType.Category
    ),
    [SuggestionField.Products]: createProducts(completion),
  };
};
