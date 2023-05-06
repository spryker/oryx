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
    key: keyof StyleProperties,
    value: string | number,
    expectedRule: string
  ): void => {
    describe(`when the ${key} is configured`, () => {
      beforeEach(() => populate({ [key]: value }));
      it('should generate the rule', () => {
        console.log(styles);
        console.log('___');
        console.log(expectedRule);

        expect(styles).toContain(expectedRule);
      });
    });
    describe(`when the ${key} is not configured`, () => {
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
    // expectStyleRule('columnCount', 9, '--cols: 9');
    expectStyleRule('gridColumn', 3, '--col-pos: 3');
    expectStyleRule('gridRow', 5, '--row-pos: 5');
    expectStyleRule('align', LayoutAlign.Center, 'align-items: center');
    expectStyleRule('align', LayoutAlign.Start, 'align-items: start');
    expectStyleRule('align', LayoutAlign.Stretch, 'align-items: stretch');
    expectStyleRule('align', LayoutAlign.End, 'align-items: end');
    // expectStyleRule('span', 3, '--span: 3');
    expectStyleRule('gap', 10, '--oryx-grid-gap-column: 10');
    expectStyleRule('gap', 10, '--oryx-grid-gap-row: 10');
    expectStyleRule(
      'gap',
      '10%',
      '--oryx-grid-gap-column: 10%;--oryx-grid-gap-row: 10%'
    );
    expectStyleRule('gap', '10%', '--oryx-grid-gap-row: 10%');
    expectStyleRule('gap', '10 5', '--oryx-grid-gap-row: 10');
    expectStyleRule('gap', '10 5', '--oryx-grid-gap-column: 5');
    expectStyleRule('top', '10', '--top: 10px');
    expectStyleRule('top', '10vh', '--top: 10vh');
    expectStyleRule('width', '100px', 'width: 100px');
    expectStyleRule('height', '100px', '--height: 100px');
    expectStyleRule('margin', '10', 'margin: 10px');
    expectStyleRule('margin', '10%', 'margin: 10%');
    expectStyleRule('padding', '15', 'padding-block: 15px');
    expectStyleRule('padding', '15%', 'padding-block: 15%');
    expectStyleRule('padding', '10px', '--scroll-start: 10px');
    expectStyleRule('padding', '10px 5px', '--scroll-start: 5px');
    expectStyleRule('padding', '10px 5px 20px', '--scroll-start: 5px');
    expectStyleRule('padding', '10px 5px 20px 30px', '--scroll-start: 30px');
    expectStyleRule('border', '15px solid red', 'border: 15px solid red');
    expectStyleRule('radius', '15', 'border-radius: 15px');
    expectStyleRule('background', 'red', 'background: red');
    expectStyleRule(
      'background',
      'url("http://lorempixel.com/1920/1080/nature"',
      'background: url("http://lorempixel.com/1920/1080/nature"'
    );
    expectStyleRule('zIndex', 3, 'z-index: 3');
    expectStyleRule('rotate', 3, '--rotate: 3deg');
    expectStyleRule('rotate', -2, '--rotate: -2deg');
    expectStyleRule('overflow', 'auto', 'overflow: auto');
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
