import { AppBuilder, SimpleAppBuilder } from './app';

export function appBuilder(): AppBuilder {
  return new SimpleAppBuilder();
}
