import { Provider } from '@spryker-oryx/di';
import { Type } from '@spryker-oryx/utilities';
import { SyncAction, SyncActionHandler } from './models';

export interface SyncActionHandlerRegistry {
  action: SyncAction;
  handlerType: Type<SyncActionHandler>;
}

export const SyncActionHandlerRegistry = 'oryx.SyncActionHandlerRegistry*';

declare global {
  export interface InjectionTokensContractMap {
    [SyncActionHandlerRegistry]: SyncActionHandlerRegistry;
  }
}

export function provideSyncActionHandler<
  TAction extends SyncAction,
  THandler extends Type<SyncActionHandler<TAction>, []>
>(action: TAction, handlerType: THandler): Provider[] {
  return [
    provideActionHandlerType(handlerType),
    provideActionHandler(action, handlerType),
  ];
}

export function provideSyncActionsHandler<
  TAction extends SyncAction,
  THandler extends Type<SyncActionHandler<TAction>, []>
>(actionsEnum: Record<string, TAction>, handlerType: THandler): Provider[] {
  return [
    provideActionHandlerType(handlerType),
    ...Object.values(actionsEnum)
      .map((action) => provideActionHandler(action, handlerType))
      .flat(),
  ];
}

function provideActionHandlerType(
  handlerType: Type<SyncActionHandler, []>
): Provider {
  return { provide: handlerType, useClass: handlerType };
}

function provideActionHandler(
  action: SyncAction,
  handlerType: Type<SyncActionHandler, []>
): Provider {
  return {
    provide: SyncActionHandlerRegistry,
    useValue: { action, handlerType } as SyncActionHandlerRegistry,
  };
}
