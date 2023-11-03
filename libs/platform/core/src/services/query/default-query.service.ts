import { inject, INJECTOR, OnDestroy } from '@spryker-oryx/di';

import { CoreQueryManager } from './core/core-query-manager';

import { Command, EffectDefinition, Query } from './models';
import {
  COMMAND_TOKEN,
  EFFECT_TOKEN,
  QUERY_TOKEN,
  QueryService,
} from './query.service';

export class DefaultQueryService
  extends CoreQueryManager
  implements QueryService, OnDestroy
{
  constructor(
    protected effects = inject(EFFECT_TOKEN, []),
    protected injector = inject(INJECTOR)
  ) {
    super();
    this.initEffects(effects);
  }

  protected initEffects(effects: EffectDefinition[]): void {
    effects.forEach((effect) => this.createEffect(effect));
  }

  override getQuery<
    ValueType = unknown,
    Qualifier extends object | undefined = undefined
  >(id: string): Query<ValueType, Qualifier> | undefined {
    const query = super.getQuery<ValueType, Qualifier>(id);
    if (query) return query;

    const providedQuery = this.injector.inject(`${QUERY_TOKEN}${id}`, null);
    if (providedQuery) {
      providedQuery.id = id;
      return this.createQuery<ValueType, Qualifier>(providedQuery);
    }

    return undefined;
  }

  override getCommand<
    ResultType = unknown,
    Qualifier extends object | undefined = undefined
  >(id: string): Command<ResultType, Qualifier> | undefined {
    const command = super.getCommand<ResultType, Qualifier>(id);
    if (command) return command;

    const providedCommand = this.injector.inject(`${COMMAND_TOKEN}${id}`, null);
    if (providedCommand) {
      providedCommand.id = id;
      return this.createCommand<ResultType, Qualifier>(providedCommand);
    }

    return undefined;
  }

  onDestroy(): void {
    this.dispose();
  }
}
