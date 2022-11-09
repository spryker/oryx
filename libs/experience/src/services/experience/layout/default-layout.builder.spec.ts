import { App, AppRef, Theme, ThemePlugin } from '@spryker-oryx/core';
import { Injector } from '@spryker-oryx/injector';
import { Size } from '@spryker-oryx/utilities';
import {
  CompositionLayout,
  CompositionProperties,
  StyleProperties,
} from '../../../models';
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
    key: string,
    value: string,
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
      it('should generate the rule', () => {
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

  describe('styles', () => {
    expectStyleRule('gap', '10px', 'gap:10px;');

    expectStyleRule('margin', '10px', '--oryx-layout-margin:10px;');
    expectStyleRuleWithUnit('margin', '10', '--oryx-layout-margin');

    expectStyleRule('padding', '10px', '--oryx-layout-padding:10px;');
    expectStyleRuleWithUnit('padding', '10', '--oryx-layout-padding');

    expectStyleRule('height', '50%', '--oryx-layout-height:50%');
    expectStyleRuleWithUnit('height', '10', '--oryx-layout-height');

    expectStyleRule('border', 'solid red 10px', 'border:solid red 10px;');

    expectStyleRule('radius', '10px', 'border-radius:10px;');
    expectStyleRuleWithUnit('radius', '10', 'radius');

    expectStyleRule('top', '10px', 'top:10px;');
    expectStyleRuleWithUnit('top', '10', 'top');

    expectStyleRule('bottom', '10px', 'bottom:10px;');
    expectStyleRuleWithUnit('bottom', '10', 'bottom');

    expectStyleRule(
      'width',
      '50%',
      '--oryx-layout-item-width:50%;flex:0 0 50%'
    );
    expectStyleRuleWithUnit('width', '10', '--oryx-layout-item-width');

    expectStyleRule('span', '4', '--oryx-layout-span:4');

    expectStyleRule('background', 'red', 'background:red;');
  });

  describe('classes', () => {
    let layoutClasses: string | undefined;
    const populateLayout = (data: CompositionProperties): void => {
      layoutClasses = service.getLayoutClasses(data);
    };

    describe('when no layout properties are provided', () => {
      beforeEach(() => {
        populateLayout({});
      });
      it('should return an undefined object', () => {
        expect(layoutClasses).toBeUndefined();
      });
    });

    describe('container', () => {
      describe('when a container is configured', () => {
        beforeEach(() => populateLayout({ rules: [{ container: true }] }));
        it('should add the container class', () => {
          expect(layoutClasses).toContain('container');
        });
      });
      describe('when a container is not configured', () => {
        beforeEach(() => populateLayout({}));
        it('should not add the container class', () => {
          expect(layoutClasses).toBeUndefined();
        });
      });
    });

    describe('jumbotron', () => {
      describe('when a jumbotron is configured', () => {
        beforeEach(() => populateLayout({ rules: [{ jumbotron: true }] }));
        it('should add the jumbotron class', () => {
          expect(layoutClasses).toContain('jumbotron');
        });
      });
      describe('when a jumbotron is not configured', () => {
        beforeEach(() => populateLayout({}));
        it('should not add the jumbotron class', () => {
          expect(layoutClasses).toBeUndefined();
        });
      });
    });

    describe('layout', () => {
      describe('column', () => {
        describe(`when the layout is column`, () => {
          beforeEach(() => {
            populateLayout({ rules: [{ layout: CompositionLayout.Column }] });
          });
          it(`should have a layout-column class`, () => {
            expect(layoutClasses).toContain('layout-column');
          });
          [1, 2, 3, 4].forEach((columnCount) => {
            describe(`and a column-count of ${columnCount} is also provided`, () => {
              beforeEach(() => {
                populateLayout({
                  rules: [
                    {
                      layout: CompositionLayout.Column,
                      columnCount,
                    },
                  ],
                });
              });
              it(`should add a column-count-${columnCount} class`, () => {
                expectStyleRule(
                  '--oryx-layout-item-count',
                  columnCount.toString(),
                  `--oryx-layout-item-count:${columnCount}`
                );
              });
            });
          });
        });
      });

      describe('carousel', () => {
        describe(`when the layout is carousel`, () => {
          beforeEach(() => {
            populateLayout({ rules: [{ layout: CompositionLayout.Carousel }] });
          });
          it(`should have a layout-carousel class`, () => {
            expect(layoutClasses).toContain('layout-carousel');
          });
        });

        describe(`when layout is not provided`, () => {
          beforeEach(() => {
            populateLayout({});
          });
          it(`should not have a layout-carousel class`, () => {
            expect(layoutClasses).toBeUndefined();
          });
        });

        describe(`when the layout is not carousel`, () => {
          beforeEach(() => {
            populateLayout({ rules: [{ layout: CompositionLayout.Column }] });
          });
          it(`should not have a layout-carousel class`, () => {
            expect(layoutClasses).not.toContain('layout-carousel');
          });
        });
      });
    });

    describe('position', () => {
      describe('when a position is sticky', () => {
        beforeEach(() => populateLayout({ rules: [{ position: 'sticky' }] }));
        it('should add the sticky class', () => {
          expect(layoutClasses).toContain('sticky');
        });
      });
      describe('when an alternative position is provided', () => {
        beforeEach(() =>
          populateLayout({ rules: [{ position: 'alternative' as any }] })
        );
        it('should not have a sticky class', () => {
          expect(layoutClasses).toBeUndefined();
        });
      });
      describe('when a container is not configured', () => {
        beforeEach(() => populateLayout({}));
        it('should not add the sticky class', () => {
          expect(layoutClasses).toBeUndefined();
        });
      });
    });
  });
});
