import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { DefaultTokenService } from './default-token-resolver.service';
import {
  ResolvedToken,
  TokenResolver,
  TokenResourceResolver,
  TokenResourceResolvers,
} from './token-resolver.service';
import { SpyInstance } from 'vitest';

class TestResolver implements TokenResourceResolver {
  resolve(resolver: string): ResolvedToken {
    return of(resolver);
  }
}

describe('DefaultTokenService', () => {
  let service: DefaultTokenService;
  let resolver: TestResolver;
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

    service = testInjector.inject<DefaultTokenService>(TokenResolver);
    resolver = testInjector.inject<TestResolver>(
      `${TokenResourceResolvers}TEST`
    );
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

  describe('when token is negative', () => {
    const token = 'TEST.!NEGATIVE_VALUE';
    let spy: SpyInstance;

    beforeEach(() => {
      spy = vi.spyOn(resolver, 'resolve');
      service.resolveToken(token).subscribe(callback);
    });

    it('should pass correct token to the resolver', () => {
      expect(spy).toHaveBeenCalledWith('NEGATIVE_VALUE');
    });

    it('should return reversal value', () => {
      expect(callback).toHaveBeenCalledWith(!'NEGATIVE_VALUE');
    });
  });
});
