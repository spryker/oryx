import { AppBuilderWithModules } from './app.model';
import { ModularAppBuilder } from './modular-app-builder';

export function appBuilder(): AppBuilderWithModules {
  return new ModularAppBuilder();
}
