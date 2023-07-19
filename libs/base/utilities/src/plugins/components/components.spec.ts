import { fixture, nextFrame } from '@open-wc/testing-helpers';
import { LitElement, TemplateResult, html } from 'lit';
import { queryFirstAssigned } from '../../misc';
import { ComponentsPlugin, ComponentsPluginName } from './components';
import { ComponentDef, componentDef } from './components.model';

const enum Tags {
  Root = 'mock-root-component',
  Preload = 'mock-preload-component',
  A = 'mock-a-component',
  B = 'mock-b-component',
  C = 'mock-c-component',
  D = 'mock-d-component',
  GlobalPreload = 'mock-global-preload-component',
}

class MockRootComponent extends LitElement {
  render(): TemplateResult {
    return html`<mock-a-component><slot></slot></mock-a-component>`;
  }
}

const components = {
  [Tags.Root]: MockRootComponent,
  [Tags.Preload]: class MockPreloadComponent extends LitElement {},
  [Tags.A]: class MockAComponent extends LitElement {},
  [Tags.B]: class MockBComponent extends LitElement {},
  [Tags.C]: class MockCComponent extends LitElement {},
  [Tags.D]: class MockDComponent extends LitElement {},
  [Tags.GlobalPreload]: class MockGlobalPreloadComponent extends LitElement {},
};

const createComponentDef = (tag: Tags, preload = false): (() => ComponentDef) =>
  componentDef({
    name: tag,
    impl: preload
      ? { load: () => Promise.resolve(components[tag]) }
      : components[tag],
  });

describe('ComponentsPlugin', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getName', () => {
    it('should return proper name', () => {
      const plugin = new ComponentsPlugin([createComponentDef(Tags.Root)], {
        root: createComponentDef(Tags.Root),
      });
      expect(plugin.getName()).toBe(ComponentsPluginName);
    });
  });

  describe('apply', () => {
    it('should throw an error if root element is not in document', async () => {
      const plugin = new ComponentsPlugin([createComponentDef(Tags.Root)], {
        root: createComponentDef(Tags.Root),
      });
      await expect(plugin.apply()).rejects.toThrow();
    });

    it('should define custom root component', async () => {
      const element = await fixture(
        html`<mock-root-component></mock-root-component>`
      );
      const plugin = new ComponentsPlugin([createComponentDef(Tags.Root)], {
        root: createComponentDef(Tags.Root),
      });
      expect(element).not.toBeInstanceOf(components[Tags.Root]);
      await plugin.apply();
      await nextFrame();
      expect(element).toBeInstanceOf(components[Tags.Root]);
    });

    it('should define custom component in shadowDom', async () => {
      const element: MockRootComponent = await fixture(
        html`<mock-root-component></mock-root-component>`
      );
      const plugin = new ComponentsPlugin(
        [createComponentDef(Tags.Root), createComponentDef(Tags.A)],
        {
          root: createComponentDef(Tags.Root),
        }
      );
      const componentInShadowDom = element.renderRoot.querySelector(Tags.A);

      expect(componentInShadowDom).not.toBeInstanceOf(components[Tags.A]);
      await plugin.apply();
      await nextFrame();
      expect(componentInShadowDom).toBeInstanceOf(components[Tags.A]);
    });

    it('should define custom component in lightDom', async () => {
      const element: MockRootComponent = await fixture(
        html`<mock-root-component>
          <mock-b-component></mock-b-component>
        </mock-root-component>`
      );
      const plugin = new ComponentsPlugin(
        [createComponentDef(Tags.Root), createComponentDef(Tags.B)],
        {
          root: createComponentDef(Tags.Root),
        }
      );
      const componentInLightDom = queryFirstAssigned(element, {
        selector: Tags.B,
      });
      expect(componentInLightDom).not.toBeInstanceOf(components[Tags.B]);
      await plugin.apply();
      await nextFrame();
      expect(componentInLightDom).toBeInstanceOf(components[Tags.B]);
    });

    it('should define custom component in preload mode', async () => {
      const element = await fixture(
        html`<mock-preload-component></mock-preload-component>`
      );
      const plugin = new ComponentsPlugin(
        [createComponentDef(Tags.Preload, true)],
        {
          root: createComponentDef(Tags.Preload),
        }
      );
      expect(element).not.toBeInstanceOf(components[Tags.Preload]);
      await plugin.apply();
      expect(element).toBeInstanceOf(components[Tags.Preload]);
    });

    it('should define custom component in preload mode if preload is true', async () => {
      const element = await fixture(
        html`<mock-global-preload-component></mock-global-preload-component>`
      );
      const plugin = new ComponentsPlugin(
        [createComponentDef(Tags.GlobalPreload)],
        {
          root: createComponentDef(Tags.GlobalPreload),
          preload: true,
        }
      );
      expect(element).not.toBeInstanceOf(components[Tags.GlobalPreload]);
      await plugin.apply();
      expect(element).toBeInstanceOf(components[Tags.GlobalPreload]);
    });
  });

  describe('registerComponents', () => {
    it('should add component to registration', async () => {
      const element: MockRootComponent = await fixture(
        html`<mock-root-component>
          <mock-c-component></mock-c-component>
        </mock-root-component>`
      );
      const plugin = new ComponentsPlugin([createComponentDef(Tags.Root)], {
        root: createComponentDef(Tags.Root),
      });
      plugin.registerComponents([createComponentDef(Tags.C)]);
      const component = queryFirstAssigned(element, {
        selector: Tags.C,
      });
      expect(component).not.toBeInstanceOf(components[Tags.C]);
      await plugin.apply();
      await nextFrame();
      expect(component).toBeInstanceOf(components[Tags.C]);
    });
  });

  describe('loadComponent', () => {
    it('should define component', async () => {
      const element: MockRootComponent = await fixture(
        html`<mock-d-component></mock-d-component>`
      );
      const plugin = new ComponentsPlugin([createComponentDef(Tags.D)], {
        root: createComponentDef(Tags.D),
      });
      await plugin.apply();
      expect(element).not.toBeInstanceOf(components[Tags.D]);
      await plugin.loadComponent(Tags.D);
      await nextFrame();
      expect(element).toBeInstanceOf(components[Tags.D]);
    });
  });
});
