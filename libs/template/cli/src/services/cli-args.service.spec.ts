import { CliCommand } from '../models';
import { CliArgsService } from './cli-args.service';

describe('CliArgsService', () => {
  class MockFeatureOptionsService {
    getFeatureOptions = vi.fn().mockReturnValue({ args: this.args });
    constructor(public args: string[] = []) {}
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

  function setup({ args = [] as string[] } = {}) {
    const mockFeatureOptionsService = new MockFeatureOptionsService(args);
    const mockInjector = new MockInjector();
    const service = new CliArgsService(
      mockFeatureOptionsService,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockInjector as any
    );
    const mockCommand = new MockCommand();

    mockInjector.inject.mockReturnValue([mockCommand]);

    return {
      service,
      mockFeatureOptionsService,
      mockInjector,
      mockCommand,
    };
  }

  it('should be created', () => {
    const { service } = setup();

    expect(service).toBeTruthy();
  });

  describe('getRawArgs() method', () => {
    it('should return the raw args', () => {
      const { service } = setup({
        args: ['mock', '--args'],
      });

      expect(service.getRawArgs()).toEqual(['mock', '--args']);
    });
  });

  describe('getCommand() method', () => {
    it('should return the command', () => {
      const { service } = setup({
        args: ['mock', '--args'],
      });

      expect(service.getCommand()).toEqual('mock');
    });

    it('should return undefined if no command', () => {
      const { service } = setup({
        args: [],
      });

      expect(service.getCommand()).toBeUndefined();
    });
  });

  describe('getValues() method', () => {
    it('should return the args values of command', () => {
      const { service } = setup({
        args: ['mock', '--arg1=val1', '--arg2'],
      });

      expect(service.getValues()).toEqual({ arg1: 'val1', arg2: true });
    });

    it('should return the args values of unknown command', () => {
      const { service } = setup({
        args: ['unknown', '--arg1=val1', '--arg2'],
      });

      expect(service.getValues()).toEqual({ arg1: 'val1', arg2: true });
    });

    it('should parse known args', () => {
      const { service, mockCommand } = setup({
        args: ['mock', '--arg1=val1', '-b', '-c'],
      });

      mockCommand.getOptions.mockReturnValue([
        { name: 'arg1', type: 'string', short: 'a' },
        { name: 'arg2', type: 'boolean', short: 'b' },
      ]);

      expect(service.getValues()).toEqual({
        arg1: 'val1',
        arg2: true,
        c: true,
      });
    });
  });

  describe('getPositionals() method', () => {
    it('should return the args positionals of command', () => {
      const { service } = setup({
        args: ['mock', 'pos1', 'pos2'],
      });

      expect(service.getPositionals()).toEqual(['pos1', 'pos2']);
    });

    it('should return the args positionals of unknown command', () => {
      const { service } = setup({
        args: ['unknown', 'pos1', 'pos2'],
      });

      expect(service.getPositionals()).toEqual(['pos1', 'pos2']);
    });
  });

  describe('get() method', () => {
    it('should return the arg value of command', () => {
      const { service } = setup({
        args: ['mock', '--arg1=val1', '--arg2'],
      });

      expect(service.get('arg1')).toEqual('val1');
      expect(service.get('arg2')).toEqual(true);
    });

    it('should return the arg value of unknown command', () => {
      const { service } = setup({
        args: ['unknown', '--arg1=val1', '--arg2'],
      });

      expect(service.get('arg1')).toEqual('val1');
      expect(service.get('arg2')).toEqual(true);
    });

    it('should return parsed known args', () => {
      const { service, mockCommand } = setup({
        args: ['mock', '--arg1=val1', '-b', '-c'],
      });

      mockCommand.getOptions.mockReturnValue([
        { name: 'arg1', type: 'string', short: 'a' },
        { name: 'arg2', type: 'boolean', short: 'b' },
      ]);

      expect(service.get('arg1')).toEqual('val1');
      expect(service.get('arg2')).toEqual(true);
      expect(service.get('c')).toEqual(true);
    });
  });

  describe('has() method', () => {
    it('should return true if arg exists', () => {
      const { service } = setup({
        args: ['mock', '--arg1=val1', '--arg2'],
      });

      expect(service.has('arg1')).toEqual(true);
      expect(service.has('arg2')).toEqual(true);
    });

    it('should return false if arg does not exist', () => {
      const { service } = setup({
        args: ['mock', '--arg1=val1', '--arg2'],
      });

      expect(service.has('arg3')).toEqual(false);
    });

    it('should return true if arg exists of unknown command', () => {
      const { service } = setup({
        args: ['unknown', '--arg1=val1', '--arg2'],
      });

      expect(service.has('arg1')).toEqual(true);
      expect(service.has('arg2')).toEqual(true);
    });

    it('should return false if arg does not exist of unknown command', () => {
      const { service } = setup({
        args: ['unknown', '--arg1=val1', '--arg2'],
      });

      expect(service.has('arg3')).toEqual(false);
    });
  });

  describe('getPositional() method', () => {
    it('should return the positional value of command', () => {
      const { service } = setup({
        args: ['mock', 'pos1', 'pos2', '--arg'],
      });

      expect(service.getPositional(0)).toEqual('pos1');
      expect(service.getPositional(1)).toEqual('pos2');
    });

    it('should return the positional value of unknown command', () => {
      const { service } = setup({
        args: ['unknown', 'pos1', 'pos2', '--arg'],
      });

      expect(service.getPositional(0)).toEqual('pos1');
      expect(service.getPositional(1)).toEqual('pos2');
    });
  });
});
