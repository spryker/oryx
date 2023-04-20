import * as prompts from '@clack/prompts';
import { HelpCliCommand } from './help';

vi.mock('@clack/prompts');

describe('HelpCliCommand', () => {
  class MockCliArgsService {
    getPositional = vi.fn();
  }

  class MockInjector {
    inject = vi.fn();
  }

  function setup() {
    const cliArgsService = new MockCliArgsService();
    const injector = new MockInjector();
    const command = new HelpCliCommand(cliArgsService as any, injector as any);

    return { command, cliArgsService, injector };
  }

  it('should create instance', () => {
    const { command } = setup();

    expect(command).toBeTruthy();
  });

  describe('getName() method', () => {
    it('should return name', () => {
      const { command } = setup();

      expect(command.getName()).toEqual('help');
    });
  });

  describe('getAliases() method', () => {
    it('should return aliases', () => {
      const { command } = setup();

      expect(command.getAliases()).toEqual(['h']);
    });
  });

  describe('execute() method', () => {
    it('should call showCommandsHelp() without command argument', async () => {
      const { command, cliArgsService } = setup();
      const showCommandsHelpSpy = vi
        .spyOn(command, 'showCommandsHelp')
        .mockReturnValue();

      await command.execute();

      expect(cliArgsService.getPositional).toHaveBeenCalledWith(0);
      expect(showCommandsHelpSpy).toHaveBeenCalled();
    });

    it('should call showCommandHelp() with command argument', async () => {
      const { command, cliArgsService } = setup();
      const showCommandHelpSpy = vi
        .spyOn(command, 'showCommandHelp')
        .mockReturnValue();
      cliArgsService.getPositional.mockReturnValue('cmd');

      await command.execute();

      expect(cliArgsService.getPositional).toHaveBeenCalledWith(0);
      expect(showCommandHelpSpy).toHaveBeenCalledWith('cmd');
    });
  });

  describe('getCliCommandsWithHelp() method', () => {
    it('should show all commands usage help', () => {
      const { command, injector } = setup();
      injector.inject.mockReturnValue([
        { getName: () => 'cmd1', getHelp: () => 'help1' },
        { getName: () => 'cmd2', getHelp: () => 'help2' },
        { getName: () => 'cmd3-hidden' },
      ]);
      const introSpy = vi.spyOn(prompts, 'intro');
      const logSpy = vi.spyOn(prompts.log, 'message');
      const outroSpy = vi.spyOn(prompts, 'outro');

      command.showCommandsHelp();

      expect(introSpy).toHaveBeenCalledWith('Oryx CLI');
      expect(logSpy).toHaveBeenCalled();
      expect(logSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
        "Available commands:

        [1mcmd1[22m [2moryx help cmd1[22m
        [1mcmd2[22m [2moryx help cmd2[22m
        "
      `);
      expect(outroSpy).toHaveBeenCalled();
    });
  });

  describe('showCommandHelp() method', () => {
    it('should show command usage help', () => {
      const { command, injector } = setup();
      injector.inject.mockReturnValue([
        { getName: () => 'cmd1', getHelp: () => 'help1' },
        { getName: () => 'cmd2', getHelp: () => 'help2' },
        { getName: () => 'cmd3-hidden' },
      ]);
      const introSpy = vi.spyOn(prompts, 'intro');
      const messageSpy = vi.spyOn(prompts.log, 'message');
      const outroSpy = vi.spyOn(prompts, 'outro');

      command.showCommandHelp('cmd2');

      expect(introSpy).toHaveBeenCalledWith('Oryx command: cmd2');
      expect(messageSpy).toHaveBeenCalled();
      expect(messageSpy.mock.calls[0][0]).toBe('help2');
      expect(outroSpy).toHaveBeenCalled();
    });

    it('should throw error if command not found', () => {
      const { command, injector } = setup();
      injector.inject.mockReturnValue([
        { getName: () => 'cmd1', getHelp: () => 'help1' },
        { getName: () => 'cmd2', getHelp: () => 'help2' },
        { getName: () => 'cmd3-hidden' },
      ]);

      expect(() => command.showCommandHelp('cmd4')).toThrowError(
        `Unknown command 'cmd4'!`
      );
    });

    it('should throw error if command has no help', () => {
      const { command, injector } = setup();
      injector.inject.mockReturnValue([
        { getName: () => 'cmd1', getHelp: () => 'help1' },
        { getName: () => 'cmd2', getHelp: () => 'help2' },
        { getName: () => 'cmd3-hidden' },
      ]);

      expect(() => command.showCommandHelp('cmd3-hidden')).toThrowError(
        `Unknown command 'cmd3-hidden'!`
      );
    });
  });
});
