import { fixture } from '@open-wc/testing-helpers';
import { collapsibleComponent } from '@spryker-oryx/ui';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { lastValueFrom } from 'rxjs';
import { CollapsibleLayoutPlugin } from './collapsible.plugin';

describe('CollapsibleLayoutPlugin', () => {
  let plugin: CollapsibleLayoutPlugin;

  beforeEach(() => {
    plugin = new CollapsibleLayoutPlugin();
  });

  beforeAll(async () => {
    await useComponent([collapsibleComponent]);
  });

  describe('getStyles', () => {
    it('should return an Observable of LayoutStyles', async () => {
      const styles = await import('./collapsible.styles').then(
        (module) => module.styles
      );
      const result = await lastValueFrom(plugin.getStyles());

      expect(result).toEqual(styles);
    });
  });

  describe('getConfig', () => {
    it('should return proper schema in the object', async () => {
      const schema = await import('./collapsible.schema').then(
        (module) => module.schema
      );
      const config = await lastValueFrom(plugin.getConfig?.());
      const result = await (config.schema as () => unknown)();

      expect(result).toEqual(schema);
    });
  });

  describe('when getRender() is called for a composition', () => {
    it('should not render anything ', async () => {
      const result = await lastValueFrom(
        plugin.getRender({ isComposition: true, options: {} }),
        { defaultValue: undefined }
      );

      expect(result).toBeUndefined();
    });
  });

  describe('when getRender() is called for a component', () => {
    describe('and the collapsibleOpen option is set to true', () => {
      let element: HTMLElement;

      beforeEach(async () => {
        const result = await lastValueFrom(
          plugin.getRender({
            isComposition: false,
            options: { collapsibleOpen: true },
          })
        );
        element = await fixture(html`<div>${result!.outer!}</div>`);
      });

      it('should render the component with the open attribute', async () => {
        expect(element).toContainElement('oryx-collapsible[open]');
      });

      describe('and there is no bucket component in the experience data', () => {
        it('should not render a bucket', async () => {
          expect(element).not.toContainElement(
            'oryx-composition[slot="heading"][bucket="label"]'
          );
        });

        describe('and there is no name on the experience data', () => {
          it('should not render the custom label', async () => {
            expect(element).not.toContainElement('span[slot="heading"]');
          });
        });

        describe('and there is a name on the experience data', () => {
          beforeEach(async () => {
            const result = await lastValueFrom(
              plugin.getRender({
                isComposition: false,
                options: { collapsibleOpen: true },
                experience: { id: '', type: '', name: 'test' },
              })
            );
            element = await fixture(html`<div>${result!.outer!}</div>`);
          });

          it('should render a custom label', async () => {
            const label = element.querySelector('span[slot="heading"]');
            expect(label?.textContent?.trim()).toEqual('test');
          });
        });
      });

      describe('and there is a bucket on the experience data', () => {
        beforeEach(async () => {
          const result = await lastValueFrom(
            plugin.getRender({
              isComposition: false,
              options: { collapsibleOpen: true },
              experience: {
                id: '',
                type: '',
                components: {
                  label: [{ id: '', type: '' }],
                },
              },
            })
          );
          element = await fixture(html`<div>${result!.outer!}</div>`);
        });

        it('should render a composition for the bucket', async () => {
          expect(element).toContainElement('oryx-composition[bucket="label"]');
        });
      });
    });
  });

  it('should wrap each child ', async () => {
    const result = await lastValueFrom(plugin.getRender({ options: {} }));
    expect(result?.outer).not.toBeUndefined();
  });
});
