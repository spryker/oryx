import { isPromise } from '@spryker-oryx/utilities';
import { ResourcePlugin, ResourcePluginName } from './resources';
import { Resources } from './resources.model';

const mockSource = './source';

const mockResources: Resources = {
  graphics: {
    a: {
      url: './url/a',
    },
    b: {
      source: () => Promise.resolve(mockSource),
    },
  },
};

describe('ResourcePlugin', () => {
  let plugin: ResourcePlugin;

  beforeEach(() => {
    plugin = new ResourcePlugin(mockResources);
    vi.resetAllMocks();
  });

  describe('when getName has been called', () => {
    it('should return proper name', () => {
      expect(plugin.getName()).toBe(ResourcePluginName);
    });
  });

  describe('when getResources has been called', () => {
    it('should return the list of resources', () => {
      expect(plugin.getResources()).toEqual(mockResources);
    });
  });

  describe('when getGraphicValue has been called', () => {
    it('should return value', () => {
      expect(plugin.getGraphicValue('a', 'url')).toBe(
        mockResources.graphics?.a.url
      );
    });

    it('should return promise with value', async () => {
      const sourcePromise = plugin.getGraphicValue('b', 'source');
      expect(isPromise(sourcePromise)).toBe(true);
      expect(await sourcePromise).toBe(mockSource);
    });

    it('should return undefined if token is not exist', () => {
      expect(plugin.getGraphicValue('c', 'source')).toBeUndefined();
    });
  });
});
