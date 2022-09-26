import {
  HttpService,
  TokenNormalizers,
  TransformerService,
} from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { of } from 'rxjs';
import { AuthAdapter } from './auth.adapter';
import { DefaultAuthAdapter } from './default-auth.adapter';

const mockLoginQualifier = {
  username: 'mockUserName',
  password: 'mockUserPassword',
};

const mockApiUrl = 'mockApiUrl';

const mockToken = {
  accessToken: 'token value',
  expiresAt: 28800,
  refreshToken: 'refresh token value',
  tokenType: 'Bearer',
  refreshTokenExpiresAt: 140,
};

class MockTransformerService implements Partial<TransformerService> {
  do = vi.fn().mockReturnValue(() => of(null));
}

describe('DefaultAuthAdapter', () => {
  let service: AuthAdapter;
  let http: HttpTestService;
  let transformer: MockTransformerService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: HttpService,
          useClass: HttpTestService,
        },
        {
          provide: AuthAdapter,
          useClass: DefaultAuthAdapter,
        },
        {
          provide: 'SCOS_BASE_URL',
          useValue: mockApiUrl,
        },
        {
          provide: TransformerService,
          useClass: MockTransformerService,
        },
      ],
    });

    service = testInjector.inject(AuthAdapter);
    transformer = testInjector.inject(
      TransformerService
    ) as unknown as MockTransformerService;
    http = testInjector.inject(HttpService) as HttpTestService;
    http.flush(mockToken);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultAuthAdapter);
  });

  describe('authenticate', () => {
    it('should send `post` request', () => {
      service.authenticate(mockLoginQualifier).subscribe();

      expect(http.url).toBe(`${mockApiUrl}/token`);
      expect(http.options).toStrictEqual({
        body: `grant_type=password&username=${mockLoginQualifier.username}&password=${mockLoginQualifier.password}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      expect(transformer.do).toHaveBeenCalledWith(TokenNormalizers);
    });
  });

  describe('refresh', () => {
    it('should send `post` request', () => {
      const mockRefreshResponse = {
        accessToken: 'accessToken',
      };
      http.flush(mockRefreshResponse);
      service.refresh(mockToken).subscribe();

      expect(http.url).toBe(`${mockApiUrl}/token`);
      expect(http.options).toStrictEqual({
        body: `grant_type=refresh_token&refresh_token=${mockToken.refreshToken}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      expect(transformer.do).toHaveBeenCalledWith(TokenNormalizers);
    });
  });
});
