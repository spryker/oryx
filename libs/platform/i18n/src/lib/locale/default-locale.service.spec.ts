import { QueryService } from '@spryker-oryx/core';
import { inject, Injector } from '@spryker-oryx/di';
import { EMPTY, of } from 'rxjs';
import { LocaleAdapter } from './adapter';
import { DefaultLocaleService } from './default-locale.service';
import { LocaleChanged } from './state';

class MockQueryService implements Partial<QueryService> {
  emit = vi.fn();
}

class MockLocaleAdapter implements LocaleAdapter {
  getAll = vi.fn().mockReturnValue(EMPTY);
  getDefault = vi.fn().mockReturnValue(EMPTY);
}

describe('DefaultLocaleService', () => {
  let adapter: MockLocaleAdapter;
  let testInjector: Injector;

  beforeEach(() => {
    testInjector = new Injector([
      { provide: DefaultLocaleService, useClass: DefaultLocaleService },
      { provide: MockLocaleAdapter, useClass: MockLocaleAdapter },
      { provide: LocaleAdapter, useFactory: () => inject(MockLocaleAdapter) },
      { provide: MockQueryService, useClass: MockQueryService },
      { provide: QueryService, useFactory: () => inject(MockQueryService) },
    ]);

    adapter = testInjector.inject(MockLocaleAdapter);
  });

  function getService() {
    return testInjector.inject(DefaultLocaleService);
  }

  it('should be provided', () => {
    expect(getService()).toBeInstanceOf(DefaultLocaleService);
  });

  describe('getAll() method', () => {
    it('should return locales from adapter.getAll()', () => {
      const callback = vi.fn();
      adapter.getAll.mockReturnValue(of('mock-locales'));

      getService().getAll().subscribe(callback);

      expect(callback).toHaveBeenCalledWith('mock-locales');
    });
  });

  describe('get() method', () => {
    it('should return locale from adapter.getDefault()', () => {
      const cb = vi.fn();
      adapter.getDefault.mockReturnValue(of('mock-locale'));

      getService().get().subscribe(cb);

      expect(cb).toHaveBeenCalledWith('mock-locale');
    });
  });

  describe('set() method', () => {
    it('should set locale', () => {
      const cb = vi.fn();
      adapter.getDefault.mockReturnValue(of('mock-locale'));

      getService().get().subscribe(cb);
      getService().set('new-locale');

      expect(cb).toHaveBeenCalledWith('mock-locale');
      expect(cb).toHaveBeenCalledWith('new-locale');
    });

    it('should emit LocaleChanged query with locale', () => {
      adapter.getDefault.mockReturnValue(of('mock-locale'));

      getService().get().subscribe();
      getService().set('new-locale');

      expect(testInjector.inject(MockQueryService).emit).toHaveBeenCalledWith({
        type: LocaleChanged,
        data: 'new-locale',
      });
    });
  });

  describe('when formatting a date and time', () => {
    beforeEach(() => {
      adapter.getDefault.mockReturnValue(of('de_DE'));
    });

    it('should return a locale formatted time', () => {
      const date = Date.now();
      const cb = vi.fn();

      getService().formatTime(date).subscribe(cb);

      expect(cb).toHaveBeenCalledWith(
        Intl.DateTimeFormat('de-DE', {
          hour: '2-digit',
          minute: '2-digit',
        }).format(date)
      );
    });

    it('should return a locale formatted date', () => {
      const date = Date.now();
      const cb = vi.fn();

      getService().formatDate(date).subscribe(cb);

      expect(cb).toHaveBeenCalledWith(
        Intl.DateTimeFormat('de-DE').format(date)
      );
    });

    it('should return a locale formatted date and time', () => {
      const date = Date.now();
      const cb = vi.fn();

      getService().formatDateTime(date).subscribe(cb);

      expect(cb).toHaveBeenCalledWith(
        Intl.DateTimeFormat('de-DE', {
          hour: '2-digit',
          minute: '2-digit',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }).format(date)
      );
    });

    it('should return a locale formatted day', () => {
      const day = 'monday';
      const cb = vi.fn();

      getService().formatDay(day).subscribe(cb);

      expect(cb).toHaveBeenCalled();
    });
  });
});
