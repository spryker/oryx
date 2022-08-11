import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { Observable, of, switchMap } from 'rxjs';
import { SpyInstanceFn } from 'vitest';
import { createSuggestionMock } from '../../mocks';
import { SuggestionQualifier } from '../../models';
import { SuggestionAdapter } from '../adapter/suggestion.adapter';
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
      ],
    });

    service = testInjector.inject(SuggestionService);
    adapter = testInjector.inject(SuggestionAdapter);
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
        expect.objectContaining({ completion: completion.slice(0, 3) })
      );
    });

    it('should get data from cache when call with the same query string', () => {
      service.get({ query: 'any' });
      expect(adapter.get).toHaveBeenCalledTimes(1);
      service.get({ query: 'any' });
      expect(adapter.get).toHaveBeenCalledTimes(1);
      service.get({ query: 'test' });
      expect(adapter.get).toHaveBeenCalledTimes(2);
    });

    it('should return an observable with null if error has been caught', () => {
      (adapter.get as SpyInstanceFn).mockReturnValue(
        of(null).pipe(
          switchMap(() => {
            throw 'error';
          })
        )
      );
      const callback = vi.fn();
      service.get({}).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(null);
    });
  });

  describe('getError method', () => {
    const mockObjectError = {
      status: 0,
      statusCode: 1,
    };

    beforeEach(() => {
      (adapter.get as SpyInstanceFn).mockReturnValue(
        of(null).pipe(
          switchMap(() => {
            throw mockObjectError;
          })
        )
      );
    });

    it('should return an observable', () => {
      expect(service.getError({})).toBeInstanceOf(Observable);
    });

    it('should return an observable with an error information', () => {
      const callback = vi.fn();
      service.getError({}).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(mockObjectError);
    });

    it('should get data from cache when call with the same query string', () => {
      service.getError({ query: 'any' });
      expect(adapter.get).toHaveBeenCalledTimes(1);
      service.getError({ query: 'any' });
      expect(adapter.get).toHaveBeenCalledTimes(1);
      service.getError({ query: 'test' });
      expect(adapter.get).toHaveBeenCalledTimes(2);
    });
  });
});
