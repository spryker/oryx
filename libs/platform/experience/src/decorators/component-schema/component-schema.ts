/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentStaticSchema } from '@spryker-oryx/core';
import { Type } from '@spryker-oryx/di';
import { DecoratorContext } from '@spryker-oryx/utilities';
import { UpdatingElement } from 'lit';
import { ComponentSchema, FieldDefinition } from './component-schema.model';

export const componentSchemaKey = Symbol.for('model-options');

type InnerComponentTypeSchema = Omit<ComponentSchema, 'options' | 'type'>;
type InnerFieldDefinition = Omit<FieldDefinition, 'id'>;

declare module '@spryker-oryx/core' {
  interface ComponentStaticSchema {
    [componentSchemaKey]?: ComponentSchema;
  }
}

const defineComponentSchema = <T extends string | undefined>(
  context: Type<unknown> & ComponentStaticSchema,
  props: T extends string ? InnerFieldDefinition : InnerComponentTypeSchema,
  name: T
): void => {
  context[componentSchemaKey] ??= {} as ComponentSchema;

  if (name) {
    context[componentSchemaKey].options ??= [];
    context[componentSchemaKey].options.push({
      id: name,
      ...props,
    });

    return;
  }

  context[componentSchemaKey] = {
    ...(context[componentSchemaKey] ?? {}),
    ...props,
  } as ComponentSchema;
};

const legacyComponentSchema = (
  context: Type<unknown>,
  props: InnerFieldDefinition | InnerComponentTypeSchema,
  name?: string
): void => {
  // TODO: remove `any` when TS-5 has been released
  defineComponentSchema(
    name ? (context.constructor as Type<unknown>) : context,
    props as any,
    name
  );
};

const standardComponentSchema = (
  context: DecoratorContext,
  props: InnerFieldDefinition | InnerComponentTypeSchema,
  name?: string
): DecoratorContext => ({
  ...context,
  finisher(clazz: typeof UpdatingElement): typeof UpdatingElement | void {
    // TODO: remove `any` when TS-5 has been released
    defineComponentSchema(
      clazz as unknown as Type<unknown>,
      props as any,
      name
    );

    return clazz;
  },
});

// TODO: remove `any` when TS-5 has been released
export const componentSchema = <T = any>(
  props: T extends Type<unknown>
    ? InnerComponentTypeSchema
    : InnerFieldDefinition
) => {
  return (context: T, name?: PropertyKey): any => {
    const isLegacy = name !== undefined || typeof context === 'function';
    const propName = (
      name !== undefined ? name : (context as unknown as DecoratorContext).key
    ) as string;

    // TODO: remove `any` when TS-5 has been released
    return isLegacy
      ? legacyComponentSchema(
          context as unknown as Type<unknown>,
          props as any,
          propName
        )
      : standardComponentSchema(
          context as unknown as DecoratorContext,
          props as any,
          propName
        );
  };
};
