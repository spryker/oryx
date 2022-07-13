import {
  createInjector,
  destroyInjector,
  getInjector,
} from '@spryker-oryx/injector';
import { DefaultStorageService } from './default-storage.service';
import { StorageType } from './model';
import { StorageService } from './storage.service';

describe('DefaultStorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: StorageService,
          useClass: DefaultStorageService,
        },
      ],
    });

    service = getInjector().inject(StorageService);
  });
  afterEach(() => {
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultStorageService);
  });

  it('should set data in local storage', () => {
    vi.spyOn(globalThis.localStorage.__proto__, 'setItem');
    service.set('mock', 'somedata');
    expect(globalThis.localStorage.setItem).toHaveBeenCalledWith(
      'mock',
      JSON.stringify('somedata')
    );
  });

  it('should get data from local storage', () => {
    vi.spyOn(globalThis.localStorage.__proto__, 'getItem');
    expect(service.get('mock')).toBe('somedata');
    expect(globalThis.localStorage.getItem).toHaveBeenCalledWith('mock');
  });

  it('should remove data from local storage', () => {
    vi.spyOn(globalThis.localStorage.__proto__, 'removeItem');
    service.remove('mock');
    expect(globalThis.localStorage.removeItem).toHaveBeenCalledWith('mock');
  });

  it('should set data in session storage', () => {
    vi.spyOn(globalThis.sessionStorage.__proto__, 'setItem');
    service.set('mock', 'sessiondata', StorageType.SESSION);
    expect(globalThis.sessionStorage.setItem).toHaveBeenCalledWith(
      'mock',
      JSON.stringify('sessiondata')
    );
  });

  it('should get data from session storage', () => {
    vi.spyOn(globalThis.sessionStorage.__proto__, 'getItem');
    expect(service.get('mock', StorageType.SESSION)).toBe('sessiondata');
    expect(globalThis.sessionStorage.getItem).toHaveBeenCalledWith('mock');
  });

  it('should remove data from session storage', () => {
    vi.spyOn(globalThis.sessionStorage.__proto__, 'removeItem');
    service.remove('mock', StorageType.SESSION);
    expect(globalThis.sessionStorage.removeItem).toHaveBeenCalledWith('mock');
  });
});
