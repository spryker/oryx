import { ReactiveControllerHost } from 'lit';
import { Effect } from '../core';
import { EffectController } from './effect.controller';

class MockHost implements Partial<ReactiveControllerHost> {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  addController() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  requestUpdate() {}
  updateComplete = Promise.resolve(true);
}

class MockEffect implements Partial<Effect> {
  start = vi.fn();
  stop = vi.fn();
}

describe('EffectController', () => {
  let controller: EffectController;
  let host: MockHost;

  beforeEach(() => {
    host = new MockHost();
    controller = new EffectController(
      host as unknown as ReactiveControllerHost
    );
  });

  it('should correctly add an effect', () => {
    const effect = new MockEffect() as unknown as Effect;
    controller.add(effect, 'testEffect');

    expect(controller.get('testEffect')).toBe(effect);
  });

  it('should correctly start effects on hostConnected', () => {
    const effect = new MockEffect() as unknown as Effect;
    controller.add(effect, 'testEffect');
    controller.hostConnected();

    expect(effect.start).toHaveBeenCalled();
  });

  it('should correctly stop effects on hostDisconnected', () => {
    const effect = new MockEffect() as unknown as Effect;
    controller.add(effect, 'testEffect');
    controller.hostDisconnected();

    expect(effect.stop).toHaveBeenCalled();
  });

  it('should replace and stop a current effect when a new one is added with the same key', () => {
    const oldEffect = new MockEffect() as unknown as Effect;
    const newEffect = new MockEffect() as unknown as Effect;

    controller.add(oldEffect, 'testEffect');
    controller.add(newEffect, 'testEffect');

    expect(oldEffect.stop).toHaveBeenCalled();
    expect(controller.get('testEffect')).toBe(newEffect);
  });

  it('should create and add an effect if a function is passed', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const func = () => {};

    controller.add(func, 'testEffect');
    const effect = controller.get('testEffect');

    expect(effect).toBeDefined();
    expect(effect).toBeInstanceOf(Effect);
  });
});
