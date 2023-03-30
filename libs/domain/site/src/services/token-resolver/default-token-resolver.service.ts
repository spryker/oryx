import { Observable, of } from 'rxjs';
import { CartResolver, UserResolver } from './resolvers';
import { TokenResolverService } from './token-resolver.service';

const tokenRE = /^[A-Z]+\.[A-Z]+$/;

interface TokenResolvers {
  USER: UserResolver;
  CART: CartResolver;
}

export class DefaultTokenResolverService implements TokenResolverService {
  protected resolvers: TokenResolvers = {
    USER: new UserResolver(),
    CART: new CartResolver(),
  };

  protected isToken(resolver: string): boolean {
    return tokenRE.test(resolver);
  }

  resolve(token: string): Observable<string | null> {
    if (!this.isToken(token)) {
      return of(token);
    }

    const [tokenResolver, resolver] = token.split('.');

    return this.resolvers[tokenResolver as keyof TokenResolvers].resolve(
      resolver
    );
  }
}
