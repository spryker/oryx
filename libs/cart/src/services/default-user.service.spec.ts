import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { Observable } from 'rxjs';
import { DefaultUserService } from './default-user.service';
import { UserService } from './user.service';

describe('DefaultUserService', () => {
  let service: UserService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: UserService,
          useClass: DefaultUserService,
        },
      ],
    });

    service = testInjector.inject(UserService);
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultUserService);
  });

  describe('get', () => {
    it('should return an observable', () => {
      expect(service.get()).toBeInstanceOf(Observable);
    });

    it('should return an observable with anonymous user data', () => {
      const callback = vi.fn();

      service.get().subscribe(callback);

      expect(callback).toHaveBeenCalledWith(
        JSON.parse(window.sessionStorage.getItem('user') as string)
      );
    });
  });
});
