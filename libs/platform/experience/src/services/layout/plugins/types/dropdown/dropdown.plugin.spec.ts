import { fixture, html } from '@open-wc/testing-helpers';
import { dropdownComponent } from '@spryker-oryx/ui';
import { useComponent } from '@spryker-oryx/utilities';
import { lastValueFrom, startWith } from 'rxjs';
import { LayoutStyles } from '../../../layout.model';
import { LayoutPluginOptionsParams } from '../../layout.plugin';
import { DropdownLayoutPlugin } from './dropdown.plugin';

describe('DropdownLayoutPlugin', () => {
  let plugin: DropdownLayoutPlugin;

  beforeEach(() => {
    plugin = new DropdownLayoutPlugin();
  });

  beforeAll(async () => {
    await useComponent([dropdownComponent]);
  });

  describe('getStyles', async () => {
    const styles = await import('./dropdown.styles').then(
      (module) => module.styles
    );

    describe('when the options contains a dropdown layout', () => {
      let result: LayoutStyles;
      beforeEach(async () => {
        result = await lastValueFrom(
          plugin.getStyles({
            options: { layout: 'dropdown' },
          } as LayoutPluginOptionsParams)
        );
      });

      it('should return an Observable of LayoutStyles', async () => {
        expect(result).toEqual(styles);
      });
    });

    describe.only('when the options not contains a dropdown layout', () => {
      let result: LayoutStyles | undefined;
      beforeEach(async () => {
        result = await lastValueFrom(
          plugin
            .getStyles({ options: {} } as LayoutPluginOptionsParams)
            .pipe(startWith(undefined))
        );
      });

      it('should not return undefined', async () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('getConfig', () => {
    it('should return proper schema in the object', async () => {
      const schema = await import('./dropdown.schema').then(
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

  describe('when getRender() is called for a composition', () => {
    let element: HTMLElement;

    beforeEach(async () => {
      const result = await lastValueFrom(
        plugin.getRender({
          isComposition: true,
          options: {},
        })
      );
      element = await fixture(html`<div>${result!.outer!}</div>`);
    });

    it('should not render a dropdown layout', async () => {
      expect(element).not.toContainElement('oryx-dropdown');
    });
  });

  describe('when getRender() is called for a component', () => {
    let element: HTMLElement;

    beforeEach(async () => {
      const result = await lastValueFrom(
        plugin.getRender({
          isComposition: false,
          options: {},
        })
      );
      element = await fixture(html`<div>${result!.outer!}</div>`);
    });

    it('should render a dropdown layout', async () => {
      expect(element).toContainElement('oryx-dropdown');
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

  //   it('should wrap each child ', async () => {
  //     const result = await lastValueFrom(plugin.getRender({ options: {} }));
  //     expect(result?.outer).not.toBeUndefined();
  //   });
});
