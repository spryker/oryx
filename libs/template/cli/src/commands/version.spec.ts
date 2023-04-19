import * as prompts from '@clack/prompts';
import { VersionCliCommand } from './version';

vi.mock('@clack/prompts');

describe('VersionCliCommand', () => {
  function setup() {
    const command = new VersionCliCommand('/mock/dir/path');

    return { command };
  }

  it('should create instance', () => {
    const { command } = setup();

    expect(command).toBeTruthy();
  });

  describe('getName() method', () => {
    it('should return name', () => {
      const { command } = setup();

      expect(command.getName()).toEqual('version');
    });
  });

  describe('getAliases() method', () => {
    it('should return aliases', () => {
      const { command } = setup();

      expect(command.getAliases()).toEqual(['-v', 'v']);
    });
  });

  describe('getHelp() method', () => {
    it('should return help text', () => {
      const { command } = setup();

      expect(command.getHelp()).toMatchInlineSnapshot(`
        "
        Prints the version of the Oryx CLI

        Usage:
          [1moryx version[22m
          [1moryx -v[22m
          "
      `);
    });
  });

  describe('execute() method', () => {
    it('should show version from getVersion() call', async () => {
      const { command } = setup();
      const versionSpy = vi
        .spyOn(command, 'getVersion')
        .mockResolvedValue('7.7.7-mock');
      const infoSpy = vi.spyOn(prompts.log, 'info');
      const introSpy = vi.spyOn(prompts, 'intro');
      const outroSpy = vi.spyOn(prompts, 'outro');

      await command.execute();

      expect(versionSpy).toHaveBeenCalled();
      expect(introSpy).toHaveBeenCalledWith('Oryx CLI');
      expect(infoSpy).toHaveBeenCalledWith('Version: 7.7.7-mock');
      expect(outroSpy).toHaveBeenCalled();
    });
  });

  describe('getVersion() method', () => {
    it('should return package version', async () => {
      vi.doMock('/mock/package.json', () => ({ version: '7.7.7-mock' }));

      const { command } = setup();

      const version = await command.getVersion();

      expect(version).toEqual('7.7.7-mock');
    });
  });
});
