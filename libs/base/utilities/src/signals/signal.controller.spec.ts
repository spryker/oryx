import { ReactiveControllerHost } from 'lit';
import { SignalController } from './signal.controller';

describe('SignalController', () => {
  let host: ReactiveControllerHost;

  beforeEach(() => {
    host = {
      addController: vi.fn(),
      requestUpdate: vi.fn(),
    } as Partial<ReactiveControllerHost> as ReactiveControllerHost;
  });

  it('constructor should add controller and set up consumer', () => {
    const signalController = new SignalController(host);
    expect(host.addController).toHaveBeenCalledWith(signalController);
  });

  it('constructor should not add the same controller twice', () => {
    const signalController = new SignalController(host);
    const signalController2 = new SignalController(host);
    expect(host.addController).toHaveBeenCalledTimes(1);
  });
});
