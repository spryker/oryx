import { App, AppRef, Theme, ThemePlugin } from '@spryker-oryx/core';
import { Injector } from '@spryker-oryx/di';
import { Size } from '@spryker-oryx/utilities';
import { LayoutAlign, StyleProperties } from '../../../models';
import { BreakpointService } from './breakpoint.service';
import { DefaultBreakpointService } from './default-breakpoint.service';
import { DefaultLayoutBuilder } from './default-layout.builder';

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
  findPlugin = vi.fn().mockReturnValue(new ThemePlugin([mockTheme]));
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

  const expectStyleRuleWithUnit = (
    key: string,
    value: string,
    expectedRule: string
  ): void => {
    describe(`when the ${key} with a value without a unit is provided`, () => {
      beforeEach(() => populate({ [key]: value }));
      it('should add px', () => {
        expect(styles).toContain(`${expectedRule}:${value}px`);
      });
    });

    describe(`when an empty string value is provided`, () => {
      beforeEach(() => populate({ [key]: '' }));
      it('should not create the rule', () => {
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
        provide: BreakpointService,
        useClass: DefaultBreakpointService,
      },
    ]);

    service = testInjector.inject('LayoutBuilder');
  });

  it('should be provided?', () => {
    expect(service).toBeInstanceOf(DefaultLayoutBuilder);
  });

  describe('style properties', () => {
    expectStyleRule('columnCount', 9, '--cols: 9');
    expectStyleRule('gridColumn', 3, '--grid-column: 3');
    expectStyleRule('gridRow', 5, '--grid-row: 5');
    expectStyleRule('align', LayoutAlign.Center, '--align-items: center');
    expectStyleRule('align', LayoutAlign.Start, '--align-items: start');
    expectStyleRule('align', LayoutAlign.Stretch, '--align-items: stretch');
    expectStyleRule('align', LayoutAlign.End, '--align-items: end');
    expectStyleRule('span', 3, '--span: 3');
    expectStyleRule('gap', 10, '--gap: 10px');
    expectStyleRule('gap', '10%', '--gap: 10%');
    expectStyleRule('top', '10', '--top: 10px');
    expectStyleRule('top', '10vh', '--top: 10vh');
    expectStyleRule('width', '100px', '--width: 100px');
    expectStyleRule('height', '100px', '--height: 100px');
    expectStyleRule('margin', '10', 'margin: 10px');
    expectStyleRule('margin', '10%', 'margin: 10%');
    expectStyleRule('padding', '15', 'padding: 15px');
    expectStyleRule('padding', '15%', 'padding: 15%');
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
    expectStyleRule('zIndex', 3, '--z-index: 3');
    expectStyleRule('rotate', 3, '--rotate: 3deg');
    expectStyleRule('rotate', -2, '--rotate: -2deg');
    expectStyleRule('overflow', 'auto', 'overflow: auto');
  });

  describe('classes', () => {
    describe('maxWidth', () => {
      let layoutClasses: string | undefined;

      describe('when a maxWidth is configured', () => {
        beforeEach(() => {
          layoutClasses = service.getLayoutClasses({
            rules: [{ maxWidth: true }],
          });
        });
        it('should add the maxWidth class', () => {
          expect(layoutClasses).toContain('maxWidth');
        });
      });
      describe('when a maxWidth is not configured', () => {
        beforeEach(() => {
          layoutClasses = service.getLayoutClasses({});
        });
        it('should not add the maxWidth class', () => {
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
