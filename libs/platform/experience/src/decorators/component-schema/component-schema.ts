import { ComponentModel } from '@spryker-oryx/core';
import { Type } from '@spryker-oryx/di';
import {
  DecoratorContext,
  isLegacyDecorator,
  TargetDecorator,
} from '@spryker-oryx/utilities';
import { UpdatingElement } from 'lit';
import { FieldDefinition } from './component-schema.model';

export const modelKey = Symbol.for('model-options');

declare module '@spryker-oryx/core' {
  interface ComponentModel {
    [modelKey]?: FieldDefinition[];
  }
}

const defineComponentSchema = (
  context: Type<unknown> & ComponentModel,
  name: string,
  props: Omit<FieldDefinition, 'id'>
): void => {
  context[modelKey] ??= [];
  context[modelKey].push({
    id: name,
    ...props,
  });
};

const legacyComponentSchema = (
  context: TargetDecorator,
  name: string,
  props: Omit<FieldDefinition, 'id'>
): void => {
  defineComponentSchema(context.constructor as Type<unknown>, name, props);
};

const standardComponentSchema = (
  context: DecoratorContext,
  name: string,
  props: Omit<FieldDefinition, 'id'>
): DecoratorContext => ({
  ...context,
  finisher(clazz: typeof UpdatingElement): void {
    defineComponentSchema(clazz as unknown as Type<unknown>, name, props);
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function componentSchema(props: Omit<FieldDefinition, 'id'>): any {
  return (
    context: DecoratorContext | TargetDecorator,
    name?: PropertyKey
  ): DecoratorContext | void => {
    const propName = (
      isLegacyDecorator(context, name) ? name : context.key
    ) as string;

    return isLegacyDecorator(context, name)
      ? legacyComponentSchema(context, propName, props)
      : standardComponentSchema(context, propName, props);
  };
}
