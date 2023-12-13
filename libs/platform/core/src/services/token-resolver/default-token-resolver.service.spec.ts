import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
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
  let resolver: TestResolver;
  let spy: SpyInstance;
  const callback = vi.fn();

  beforeEach(() => {
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
    destroyInjector();
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

  describe('when conditional token is provided', () => {
    describe('and all tokens are valid', () => {
      const token = 'TEST.TOKEN_ONE || TEST.TOKEN_TWO';
      beforeEach(() => {
        service.resolveToken(token).subscribe(callback);
      });

      it('should resolve tokens with `true` value', () => {
        expect(callback).toHaveBeenCalledWith(true);
      });
    });

    describe('and non-existent resolvers provided', () => {
      describe('all tokens have non-existent resolvers', () => {
        beforeEach(() => {
          service
            .resolveToken('FAKE.TOKEN_ONE || FAKE.TOKEN_TWO')
            .subscribe(callback);
        });

        it('should resolve tokens with `false` value', () => {
          expect(callback).toHaveBeenCalledWith(false);
        });
      });

      describe('some tokens has non-existent resolvers', () => {
        beforeEach(() => {
          service.resolveToken('FAKE.TOKEN || TEST.TOKEN').subscribe(callback);
        });

        it('should resolve tokens with `true` value', () => {
          expect(callback).toHaveBeenCalledWith(true);
        });
      });
    });

    describe('and falsy values are resolved', () => {
      describe('all tokens have falsy resolved values', () => {
        beforeEach(() => {
          resolver.resolve = vi.fn().mockReturnValue(of(false));
          service
            .resolveToken('TEST.TOKEN_ONE || TEST.TOKEN_TWO')
            .subscribe(callback);
        });

        it('should resolve tokens with `false` value', () => {
          expect(callback).toHaveBeenCalledWith(false);
        });
      });

      describe('some tokens have falsy resolved values', () => {
        beforeEach(() => {
          resolver.resolve = vi
            .fn()
            .mockReturnValueOnce(of(false))
            .mockReturnValue(of(true));
          service
            .resolveToken('TEST.TOKEN_ONE || TEST.TOKEN_TWO')
            .subscribe(callback);
        });

        it('should resolve tokens with `true` value', () => {
          expect(callback).toHaveBeenCalledWith(true);
        });
      });
    });

    describe('and tokens are negated', () => {
      beforeEach(() => {
        spy = vi.spyOn(resolver, 'resolve');
      });

      describe('all tokens are negated', () => {
        beforeEach(() => {
          service
            .resolveToken('TEST.!TOKEN_ONE || TEST.!TOKEN_TWO')
            .subscribe(callback);
        });

        it('should pass correct tokens to the resolver', () => {
          expect(spy).toHaveBeenNthCalledWith(1, 'TOKEN_ONE', undefined);
          expect(spy).toHaveBeenNthCalledWith(2, 'TOKEN_TWO', undefined);
        });

        it('should resolve tokens with `false` value', () => {
          expect(callback).toHaveBeenCalledWith(false);
        });
      });

      describe('some tokens are negated', () => {
        beforeEach(() => {
          service
            .resolveToken('TEST.!TOKEN_ONE || TEST.TOKEN_TWO')
            .subscribe(callback);
        });

        it('should pass correct tokens to the resolver', () => {
          expect(spy).toHaveBeenNthCalledWith(1, 'TOKEN_ONE', undefined);
          expect(spy).toHaveBeenNthCalledWith(2, 'TOKEN_TWO', undefined);
        });

        it('should resolve tokens with `true` value', () => {
          expect(callback).toHaveBeenCalledWith(true);
        });
      });
    });

    describe('and invalid tokens provided', () => {
      describe('all tokens are invalid', () => {
        beforeEach(() => {
          service.resolveToken('ONE || TWO').subscribe(callback);
        });

        it('should resolve the token with `false` value', () => {
          expect(callback).toHaveBeenCalledWith(false);
        });
      });

      describe('some tokens are invalid', () => {
        beforeEach(() => {
          service
            .resolveToken('ONE || TEST.RESOLVED_VALUE')
            .subscribe(callback);
        });

        it('should resolve the token with `true` value', () => {
          expect(callback).toHaveBeenCalledWith(true);
        });
      });
    });
  });

  describe('when token is negative', () => {
    const token = 'TEST.!NEGATIVE_VALUE';

    beforeEach(() => {
      spy = vi.spyOn(resolver, 'resolve');
      service.resolveToken(token).subscribe(callback);
    });

    it('should pass correct token to the resolver', () => {
      expect(spy).toHaveBeenCalledWith('NEGATIVE_VALUE', undefined);
    });

    it('should return reversal value', () => {
      expect(callback).toHaveBeenCalledWith(false);
    });
  });

  describe('when options are provided', () => {
    const token = 'TEST.WITH_OPTIONS';
    const options = { contextElement: {} as HTMLElement };

    beforeEach(() => {
      spy = vi.spyOn(resolver, 'resolve');
      service.resolveToken(token, options).subscribe(callback);
    });

    it('should pass options to the resolver', () => {
      expect(spy).toHaveBeenCalledWith('WITH_OPTIONS', options);
    });
  });
});
