import { LitElement, ReactiveControllerHost, ReactiveElement } from 'lit';
import { isLegacyDecorator } from '../../guards';
import { DecoratorContext, TargetDecorator } from '../../model';
import { Effect } from '../core';
import { EffectController } from './effect.controller';

const EFFECT_CONTROLLER = Symbol('effectController');

interface ElementWithController extends LitElement {
  [EFFECT_CONTROLLER]?: EffectController;
}

function controllerCreation(target: TargetDecorator): void {
  if (!target[EFFECT_CONTROLLER]) {
    const descriptor = {
      value: new EffectController(target as ReactiveControllerHost),
      enumerable: false,
      configurable: true,
    };

    Object.defineProperty(target, EFFECT_CONTROLLER, descriptor);
  }
}

const legacyElementEffect = (
  context: ElementWithController,
  name: string
): void => {
  const constructor = context.constructor as typeof LitElement;
  const willUpdate = context['willUpdate'];

  Object.defineProperty(context, name, {
    get: function (this: TargetDecorator) {
      return (this[EFFECT_CONTROLLER] as EffectController).get(name);
    },
    set: function (this: TargetDecorator, effect: Effect | (() => void)) {
      (this[EFFECT_CONTROLLER] as EffectController).add(effect, name);
    },
    configurable: true,
  });

  context['willUpdate'] = function (props): void {
    (this[EFFECT_CONTROLLER] as EffectController).hostConnected();
    willUpdate.call(this, props);
  };

  constructor.addInitializer((instance: ReactiveElement) => {
    controllerCreation(instance as TargetDecorator);
  });
};

const standardElementEffect = (
  context: DecoratorContext,
  name: string
): DecoratorContext => {
  return {
    ...context,
    initializer(this: TargetDecorator): void {
      const effect = context.initializer?.call(this);
      controllerCreation(this);
      (this[EFFECT_CONTROLLER] as EffectController).add(effect, name);
      return effect;
    },
  };
};

/**
 * Decorator to easily tie effects to component lifecycles:
 *   - effect will start when component is connected to DOM
 *   - effect will stop when component is disconnected from DOM
 */
export function elementEffect() {
  return <T extends LitElement>(
    context: T | DecoratorContext,
    name?: PropertyKey
  ): any => {
    const propName = (
      isLegacyDecorator(context as DecoratorContext, name)
        ? name
        : (context as DecoratorContext).key
    ) as string;

    return isLegacyDecorator(context as DecoratorContext, name)
      ? legacyElementEffect(context as T, propName)
      : (standardElementEffect(
          context as DecoratorContext,
          propName
        ) as unknown as void);
  };
}
