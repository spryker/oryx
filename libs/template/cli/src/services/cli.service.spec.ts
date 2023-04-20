import { CliCommand } from '../models';
import { CliService } from './cli.service';

describe('CliService', () => {
  class MockCliArgsService {
    getCommand = vi.fn().mockReturnValue('mock');
  }

  class MockInjector {
    inject = vi.fn();
  }

  class MockCommand implements CliCommand {
    getName = vi.fn().mockReturnValue('mock');
    execute = vi.fn();
    getOptions = vi.fn();
    getAliases = vi.fn().mockReturnValue([]);
    getHelp = vi.fn();
  }

  function setup() {
    const mockCliArgsService = new MockCliArgsService();
    const mockInjector = new MockInjector();
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const service = new CliService(
      mockCliArgsService as any,
      mockInjector as any
    );
    /* eslint-enable @typescript-eslint/no-explicit-any */
    const mockCommand = new MockCommand();

    mockInjector.inject.mockReturnValue([mockCommand]);

    return {
      service,
      mockCliArgsService,
      mockInjector,
      mockCommand,
    };
  }

  it('should be created', () => {
    const { service } = setup();

    expect(service).toBeTruthy();
  });

  describe('run() method', () => {
    it('should throw an error if no command specified', async () => {
      const { service, mockCliArgsService } = setup();
      mockCliArgsService.getCommand.mockReturnValue(undefined);

      await expect(service.run()).rejects.toThrow();
    });

    it('should throw an error if command is unknown', async () => {
      const { service, mockCliArgsService } = setup();
      mockCliArgsService.getCommand.mockReturnValue('unknown');

      await expect(service.run()).rejects.toThrow();
    });

    it('should call execute() of the command', async () => {
      const { service, mockCommand } = setup();

      await service.run();

      expect(mockCommand.execute).toHaveBeenCalledTimes(1);
    });
  });
});
