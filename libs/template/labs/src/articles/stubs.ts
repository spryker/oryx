import { inject, Type } from '@spryker-oryx/di';
import { of } from 'rxjs';

const logged: Record<string, number> = {};
export const logMissingEnv = (tokens: string[]): void => {
  const values = tokens.join(', ');

  if (logged[values] > 0) return;
  console.warn(`Missing ${values} environment variable(s)`);
  logged[values]++;
};
export const factory = (clazz: Type<unknown>, tokens: string[]): unknown => {
  if (tokens.some((token) => !inject(token))) {
    logMissingEnv(tokens);
    return { get: () => of({}) };
  }

  return new clazz();
};
