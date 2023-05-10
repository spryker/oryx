import { App, AppRef } from '@spryker-oryx/core';
import { Injector } from '@spryker-oryx/di';
import { Size } from '@spryker-oryx/utilities';
import { LayoutAlign, StyleProperties } from '../../models';
import { Theme, ThemePlugin } from '../../plugins';
import { DefaultLayoutBuilder } from './default-layout.builder';
import { DefaultScreenService } from './default-screen.service';
import { ScreenService } from './screen.service';

const mockTheme: Theme = {
  name: 'name',
  breakpoints: {
    [Size.Sm]: {
      min: 0,
    },
    [Size.Md]: {
      min: 768,
    },
    [Size.Lg]: {
      min: 1024,
    },
  },
};

class MockApp implements Partial<App> {
  requirePlugin = vi.fn().mockReturnValue(new ThemePlugin([mockTheme]));
}

describe('DefaultLayoutBuilder', () => {
  let service: DefaultLayoutBuilder;

  let styles: string | undefined;

  const populate = (data: StyleProperties): void => {
    styles = service.getLayoutStyles(data);
  };

  const expectStyleRule = (
    data: StyleProperties,
    expectedRule: string
  ): void => {
    const keys = Object.keys(data);

    describe(`when the ${keys.join('')} is configured`, () => {
      beforeEach(() => {
        styles = service.getLayoutStyles(data);
      });

      it('should generate the rule', () => {
        expect(styles).toContain(expectedRule);
      });
    });

    describe(`when the ${keys} is not configured`, () => {
      beforeEach(() => populate({}));
      it('should not generate the rule', () => {
        expect(styles).toBeUndefined();
      });
    });
  };

  beforeEach(() => {
    const testInjector = new Injector([
      {
        provide: AppRef,
        useClass: MockApp,
      },
      {
        provide: 'LayoutBuilder',
        useClass: DefaultLayoutBuilder,
      },
      {
        provide: ScreenService,
        useClass: DefaultScreenService,
      },
    ]);

    service = testInjector.inject('LayoutBuilder');
  });

  it('should be provided?', () => {
    expect(service).toBeInstanceOf(DefaultLayoutBuilder);
  });

  describe('style properties', () => {
    expectStyleRule({ columnCount: 6 }, '--oryx-grid-columns: 6');
    expectStyleRule({ splitColumnFactor: 0.25 }, '--split-column-start: 0.25');

    expectStyleRule({ gridColumn: 5 }, 'grid-column: 5');
    expectStyleRule({ colSpan: 2 }, 'grid-column: span 2');
    expectStyleRule({ gridColumn: 5, colSpan: 2 }, 'grid-column: 5 / span 2');

    expectStyleRule({ gridRow: 5 }, 'grid-row: 5');
    expectStyleRule({ rowSpan: 2 }, 'grid-row: span 2');
    expectStyleRule({ gridRow: 5, rowSpan: 2 }, 'grid-row: 5 / span 2');

    expectStyleRule({ align: LayoutAlign.Center }, '--align: center');
    expectStyleRule({ align: LayoutAlign.Start }, '--align: start');
    expectStyleRule({ align: LayoutAlign.Stretch }, '--align: stretch');
    expectStyleRule({ align: LayoutAlign.End }, '--align: end');

    expectStyleRule({ gap: '10' }, '--column-gap: 10');
    expectStyleRule({ gap: '10%' }, '--column-gap: 10%;--row-gap: 10%');
    expectStyleRule({ gap: '10 5' }, '--column-gap: 5');
    expectStyleRule({ gap: '10' }, '--row-gap: 10');
    expectStyleRule({ gap: '10%' }, '--row-gap: 10%');
    expectStyleRule({ gap: '10 5' }, '--row-gap: 10');
    expectStyleRule({ top: '10' }, 'inset-block-start: 10px');
    expectStyleRule({ top: '10vh' }, 'inset-block-start: 10vh');

    expectStyleRule({ height: '100px' }, 'height: 100px');
    expectStyleRule({ width: '100px' }, 'width: 100px');

    expectStyleRule(
      { sticky: true, height: '100px' },
      'max-height: calc(100px - 0px)'
    );
    expectStyleRule(
      { sticky: true, height: '100px', top: '10px' },
      'max-height: calc(100px - 10px)'
    );
    expectStyleRule(
      { sticky: true, top: '10px' },
      'max-height: calc(100vh - 10px)'
    );
    expectStyleRule({ sticky: true }, 'max-height: calc(100vh - 0px)');

    expectStyleRule({ margin: '10' }, 'margin: 10px');
    expectStyleRule({ margin: '10%' }, 'margin: 10%');
    expectStyleRule({ padding: '15' }, 'padding-block: 15px');
    expectStyleRule({ padding: '15%' }, 'padding-block: 15%');
    expectStyleRule({ padding: '10px' }, 'scroll-padding: 10px');
    expectStyleRule({ padding: '10px 5px' }, 'scroll-padding: 5px');
    expectStyleRule({ padding: '10px 5px 20px' }, 'scroll-padding: 5px');
    expectStyleRule({ padding: '10px 5px 20px 30px' }, 'scroll-padding: 30px');

    expectStyleRule({ border: '15px solid red' }, 'border: 15px solid red');
    expectStyleRule({ radius: '15' }, 'border-radius: 15px');

    expectStyleRule({ background: 'red' }, 'background: red');
    expectStyleRule(
      { background: 'url("http://lorempixel.com/1920/1080/nature"' },
      'background: url("http://lorempixel.com/1920/1080/nature"'
    );

    expectStyleRule({ zIndex: 3 }, 'z-index: 3');
    expectStyleRule({ rotate: 3 }, 'rotate: 3deg');
    expectStyleRule({ rotate: -2 }, 'rotate: -2deg');

    expectStyleRule({ overflow: 'auto' }, 'overflow: auto');
  });

  describe('classes', () => {
    describe('bleed', () => {
      let layoutClasses: string | undefined;

      describe('when a bleed is configured', () => {
        beforeEach(() => {
          layoutClasses = service.getLayoutClasses({
            rules: [{ bleed: true }],
          });
        });
        it('should add the bleed class', () => {
          expect(layoutClasses).toContain('bleed');
        });
      });
      describe('when a bleed is not configured', () => {
        beforeEach(() => {
          layoutClasses = service.getLayoutClasses({});
        });
        it('should not add the bleed class', () => {
          expect(layoutClasses).toBeUndefined();
        });
      });
    });

    describe('sticky', () => {
      let layoutClasses: string | undefined;
      describe('when a sticky = true', () => {
        beforeEach(() => {
          layoutClasses = service.getLayoutClasses({
            rules: [{ sticky: true }],
          });
        });
        it('should add the sticky class', () => {
          expect(layoutClasses).toContain('sticky');
        });
      });

      describe('when sticky position is not provided', () => {
        beforeEach(() => {
          layoutClasses = service.getLayoutClasses({ rules: [] });
        });
        it('should add the sticky class', () => {
          expect(layoutClasses).toBeUndefined();
        });
      });
    });
  });
});
