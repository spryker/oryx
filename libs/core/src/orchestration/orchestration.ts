import { AppBuilderWithModules, ModularAppBuilder } from './app';

export function app(): AppBuilderWithModules {
  return new ModularAppBuilder();
}
