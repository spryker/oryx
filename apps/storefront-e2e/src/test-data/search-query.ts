import { TestSearchData } from '../types/search.type';

const queries: TestSearchData[] = [
  {
    searchQuery: 'notebooks',
  },
  {
    searchQuery: 'smartwatches',
  },
  // short-term search
  {
    searchQuery: 'sma',
  },
  // no results search
  {
    searchQuery: 'blablablatest123',
  },
];

export class SearchStorage {
  static getQueryByEq(eq: number): TestSearchData {
    if (eq >= queries.length) {
      throw new Error(`Product with eq = ${eq} does not exist.`);
    }

    return queries[eq];
  }
}
