import { inject } from '@spryker-oryx/di';
import { QueryService } from '../query.service';
import { injectQuery } from './inject-query';

vi.mock('@spryker-oryx/di', () => ({
  inject: vi.fn().mockReturnValue({
    getQuery: vi.fn((queryId) =>
      queryId === 'test-query-id' ? {} : undefined
    ),
  }),
}));

describe('injectQuery', () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('should inject query with provided id', () => {
    const mockId = 'test-query-id';

    const injectedQuery = injectQuery<string, { id: number }>(mockId);

    expect(inject).toHaveBeenCalledWith(QueryService);
    expect(injectedQuery).toBeTruthy();
  });

  it('should throw an error if query with provided id is not provided', () => {
    const mockId = 'no-query-id';

    expect(() => injectQuery(mockId)).toThrow(
      `Query with id "${mockId}" is not provided`
    );
  });
});
