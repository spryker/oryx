import { SearchParameters } from '../../types/domain.types';

const parameters: SearchParameters[] = [
  {
    q: 'notebooks',
  },
  {
    q: 'smartwatches',
  },
  // minimal search query
  {
    q: 'sma',
  },
  // no results search
  {
    q: 'blablablatest123',
  },
];

export class SearchParamsStorage {
  static getByEq(eq: number): SearchParameters {
    if (eq >= parameters.length)
      throw new Error(`Search Query with eq = ${eq} does not exist.`);

    return parameters[eq];
  }
}
