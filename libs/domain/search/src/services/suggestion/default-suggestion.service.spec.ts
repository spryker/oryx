import { DefaultQueryService, QueryService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { createSuggestionMock } from '@spryker-oryx/search/mocks';
import { SemanticLinkType } from '@spryker-oryx/site';
import { Observable, of, switchMap, take } from 'rxjs';
import { SpyInstance } from 'vitest';
import { SuggestionQualifier } from '../../models';
import {
  SuggestionAdapter,
  SuggestionField,
} from '../adapter/suggestion.adapter';
import { DefaultSuggestionService } from './default-suggestion.service';
import { SuggestionService } from './suggestion.service';

const completion = ['test', 'test 1', 'test 2', 'any', 'any test'];

class MockedAdapter implements Partial<SuggestionAdapter> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  getKey = (qualifier: SuggestionQualifier): string => qualifier.query ?? '';
  get = vi
    .fn()
    .mockImplementation((qualifier: SuggestionQualifier) =>
      of(createSuggestionMock(qualifier, completion))
    );
}

describe('DefaultSuggestionService', () => {
  let service: SuggestionService;
  let adapter: SuggestionAdapter;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: SuggestionService,
          useClass: DefaultSuggestionService,
        },
        {
          provide: SuggestionAdapter,
          useClass: MockedAdapter,
        },
        {
          provide: QueryService,
          useClass: DefaultQueryService,
        },
      ],
    });

    service = testInjector.inject(SuggestionService);
    adapter = testInjector.inject(SuggestionAdapter)[0];
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultSuggestionService);
  });

  describe('get method', () => {
    it('should return an observable', () => {
      expect(service.get({})).toBeInstanceOf(Observable);
    });

    it('should return suggestion with completion', () => {
      const callback = vi.fn();
      service.get({ query: 'tes' }).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          [SuggestionField.Suggestions]: completion
            .slice(0, 3)
            .map((name) => ({
              name,
              params: { q: name },
              type: SemanticLinkType.ProductList,
            })),
        })
      );
    });

    it('should get data from cache when call with the same query string', () => {
      service.get({ query: 'any' }).pipe(take(1)).subscribe();
      expect(adapter.get).toHaveBeenCalledTimes(1);
      service.get({ query: 'any' }).pipe(take(1)).subscribe();
      expect(adapter.get).toHaveBeenCalledTimes(1);
      service.get({ query: 'test' }).pipe(take(1)).subscribe();
      expect(adapter.get).toHaveBeenCalledTimes(2);
    });

    it('should return an observable with undefined if error has been caught', () => {
      (adapter.get as unknown as SpyInstance).mockReturnValue(
        of(null).pipe(
          switchMap(() => {
            throw 'error';
          })
        )
      );
      const callback = vi.fn();
      service.get({}).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getState method', () => {
    const mockObjectError = {
      status: 0,
      statusCode: 1,
    };

    beforeEach(() => {
      (adapter.get as unknown as SpyInstance).mockReturnValue(
        of(null).pipe(
          switchMap(() => {
            throw mockObjectError;
          })
        )
      );
    });

    it('should return an observable', () => {
      expect(service.getState({})).toBeInstanceOf(Observable);
    });

    it('should return an observable with an error information', () => {
      const callback = vi.fn();
      service.getState({}).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ error: mockObjectError })
      );
    });

    it('should get data from cache when call with the same query string', () => {
      service.getState({ query: 'any' }).pipe(take(1)).subscribe();
      expect(adapter.get).toHaveBeenCalledTimes(1);
      service.getState({ query: 'any' }).pipe(take(1)).subscribe();
      expect(adapter.get).toHaveBeenCalledTimes(1);
      service.getState({ query: 'test' }).pipe(take(1)).subscribe();
      expect(adapter.get).toHaveBeenCalledTimes(2);
    });
  });
});
