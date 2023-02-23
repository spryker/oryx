import { inject, INJECTOR, OnDestroy } from '@spryker-oryx/di';
import { Command } from './command';
import { CoreQueryService } from './core';
import { Query } from './query';
import {
  COMMAND_TOKEN,
  EFFECT_TOKEN,
  QueryService,
  QUERY_TOKEN,
} from './query.service';

export class DefaultQueryService
  extends CoreQueryService
  implements QueryService, OnDestroy
{
  constructor(
    effects = inject(EFFECT_TOKEN, []),
    protected injector = inject(INJECTOR)
  ) {
    super();
    this.initEffects(effects);
  }

  protected initEffects(effects: any[]): void {
    effects.forEach((effect) => this.createEffect(effect));
  }

  override getQuery<
    ValueType = unknown,
    Qualifier extends object | undefined = undefined
  >(id: string): Query<ValueType, Qualifier> | undefined {
    const query = super.getQuery<ValueType, Qualifier>(id);
    if (query) {
      return query;
    }

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
    if (command) {
      return command;
    }

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
