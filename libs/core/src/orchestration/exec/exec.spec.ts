import { App } from '../app';
import { ExecPlugin, ExecPluginName, ExecPluginRuntime } from './exec';

const mockFn = vi.fn();
const mockApp = 'mockApp' as unknown as App;

describe('ExecPluginRuntime', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('getName should return proper name', () => {
    const plugin = new ExecPlugin(mockFn);
    expect(plugin.getName()).toBe(ExecPluginName);
  });

  it('beforeApply should call fn function runtime options has been passed with proper value', () => {
    let plugin = new ExecPlugin(mockFn, {
      run: ExecPluginRuntime.afterApply,
    });
    plugin.beforeApply();
    expect(mockFn).not.toHaveBeenCalled();
    plugin = new ExecPlugin(mockFn, {
      run: ExecPluginRuntime.beforeApply,
    });
    plugin.beforeApply();
    expect(mockFn).toHaveBeenCalledWith(undefined);
  });

  it('apply should call function if runtime options has not been passed', () => {
    let plugin = new ExecPlugin(mockFn, {
      run: ExecPluginRuntime.afterApply,
    });
    plugin.apply(mockApp);
    expect(mockFn).not.toHaveBeenCalled();
    plugin = new ExecPlugin(mockFn);
    plugin.apply(mockApp);
    expect(mockFn).toHaveBeenCalledWith(mockApp);
  });

  it('afterApply should call fn function runtime options has been passed with proper value', () => {
    let plugin = new ExecPlugin(mockFn, {
      run: ExecPluginRuntime.beforeApply,
    });
    plugin.apply(mockApp);
    plugin.afterApply();
    expect(mockFn).not.toHaveBeenCalled();
    plugin = new ExecPlugin(mockFn, {
      run: ExecPluginRuntime.afterApply,
    });
    plugin.apply(mockApp);
    plugin.afterApply();
    expect(mockFn).toHaveBeenCalledWith(mockApp);
  });
});
