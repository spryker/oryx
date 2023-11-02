import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  DefaultRegistrationService,
  RegistrationAdapter,
  RegistrationService,
} from '@spryker-oryx/user';
import { of } from 'rxjs';
import { beforeEach } from 'vitest';

class MockRegistrationAdapter implements Partial<RegistrationAdapter> {
  register = vi.fn().mockReturnValue(of(null));
}

describe('DefaultRegistrationService', () => {
  let service: RegistrationService;
  let adapter: RegistrationAdapter;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: RegistrationService,
          useClass: DefaultRegistrationService,
        },
        {
          provide: RegistrationAdapter,
          useClass: MockRegistrationAdapter,
        },
      ],
    });

    adapter = testInjector.inject(RegistrationAdapter);
    service = testInjector.inject(RegistrationService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('register', () => {
    const callback = vi.fn();

    const data = {
      salutation: 'Mr',
      gender: 'Male',
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@test.com',
      password: '123',
    };
    beforeEach(() => {
      service.register(data).subscribe();
    });

    it('should call the adapter `register` method', () => {
      expect(adapter.register).toHaveBeenCalledWith({
        ...data,
        confirmPassword: data.password,
      });
    });
  });
});
