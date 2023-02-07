import { DecoratorContext, TargetDecorator } from '../model';

export const isLegacyDecorator = (
  context: DecoratorContext | TargetDecorator,
  name?: PropertyKey
): context is TargetDecorator => {
  return name !== undefined;
};
