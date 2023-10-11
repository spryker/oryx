import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  DefaultRegistrationAdapter,
  RegistrationAdapter,
  UserNormalizer,
  UserSerializer,
} from '@spryker-oryx/user';
import { of } from 'rxjs';
import { beforeEach } from 'vitest';

const mockApiUrl = 'mockApiUrl';
const serializedData = 'serializedData';

const mockTransformer = {
  do: vi.fn().mockReturnValue(() => of(null)),
  serialize: vi.fn().mockReturnValue(of(serializedData)),
};

class MockHttpService implements Partial<HttpService> {
  post = vi.fn().mockReturnValue(of(null));
}

describe('DefaultRegistrationAdapter', () => {
  let http: HttpTestService;
  let adapter: RegistrationAdapter;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: 'SCOS_BASE_URL',
          useValue: mockApiUrl,
        },
        {
          provide: JsonAPITransformerService,
          useValue: mockTransformer,
        },
        {
          provide: RegistrationAdapter,
          useClass: DefaultRegistrationAdapter,
        },
        {
          provide: HttpService,
          useClass: MockHttpService,
        },
      ],
    });

    http = testInjector.inject<HttpTestService>(HttpService);
    adapter = testInjector.inject<RegistrationAdapter>(RegistrationAdapter);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(adapter).toBeInstanceOf(DefaultRegistrationAdapter);
  });

  describe('register', () => {
    const data = {
      salutation: 'Mr',
      gender: 'Male',
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@test.com',
      password: '123',
      confirmPassword: '123',
    };

    beforeEach(() => {
      adapter.register(data).subscribe();
    });

    it('should make a POST request', () => {
      expect(http.post).toHaveBeenCalledWith(
        `${mockApiUrl}/customers`,
        serializedData
      );
    });

    it('should call transformer serialize method', () => {
      expect(mockTransformer.serialize).toHaveBeenCalledWith(
        data,
        UserSerializer
      );
    });

    it('should call transformer do method', () => {
      expect(mockTransformer.do).toHaveBeenCalledWith(UserNormalizer);
    });
  });
});
