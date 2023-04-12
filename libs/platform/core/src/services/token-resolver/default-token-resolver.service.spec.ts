import { createInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { DefaultTokenService } from './default-token-resolver.service';
import {
  ResolvedToken,
  TokenResolver,
  TokenResourceResolver,
  TokenResourceResolvers,
} from './token-resolver.service';

class TestResolver implements TokenResourceResolver {
  resolve(resolver: string): ResolvedToken {
    return of(resolver);
  }
}

describe('DefaultTokenService', () => {
  let service: DefaultTokenService;
  const callback = vi.fn();

  beforeAll(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: TokenResolver,
          useClass: DefaultTokenService,
        },
        {
          provide: `${TokenResourceResolvers}TEST`,
          useClass: TestResolver,
        },
      ],
    });

    service = testInjector.inject(TokenResolver) as DefaultTokenService;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when token just a string', () => {
    const notToken = 'test';
    beforeEach(() => {
      service.resolveToken(notToken).subscribe(callback);
    });

    it('should resolve string as result', () => {
      expect(callback).toHaveBeenCalledWith(notToken);
    });
  });

  describe('when token for non-existent resolver provided', () => {
    const incorrectResolver = 'FAKE.TEST';
    beforeEach(() => {
      service.resolveToken(incorrectResolver).subscribe(callback);
    });

    it('should resolve token as result', () => {
      expect(callback).toHaveBeenCalledWith(incorrectResolver);
    });
  });

  describe('when correct token provided', () => {
    const token = 'TEST.RESOLVED_VALUE';
    beforeEach(() => {
      service.resolveToken(token).subscribe(callback);
    });

    it('should resolve the token', () => {
      expect(callback).toHaveBeenCalledWith('RESOLVED_VALUE');
    });
  });
});
