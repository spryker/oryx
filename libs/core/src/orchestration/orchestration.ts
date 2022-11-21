import { AppBuilderWithModules, ModularAppBuilder } from './app';

export function appBuilder(): AppBuilderWithModules {
  return new ModularAppBuilder();
}
