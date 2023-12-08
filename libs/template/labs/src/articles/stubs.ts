import { inject } from '@spryker-oryx/di';
import { Type } from '@spryker-oryx/utilities';
import { of } from 'rxjs';

const logged: Record<string, number> = {};
export const logMissingEnv = (tokens: string[]): void => {
  const values = tokens.join(', ');

  if (logged[values] > 0) return;
  console.warn(`Missing ${values} environment variable(s)`);
  logged[values]++;
};
export const getClassByRequiredTokens = (
  clazz: Type<unknown>,
  tokens: string[]
): unknown => {
  if (tokens.some((token) => !inject(token, false))) {
    logMissingEnv(tokens);
    return { get: () => of({}), getAll: () => of([]) };
  }

  return new clazz();
};
