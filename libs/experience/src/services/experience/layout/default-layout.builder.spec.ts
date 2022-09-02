import { Injector } from '@spryker-oryx/injector';
import {
  CompositionLayout,
  CompositionProperties,
  StyleProperties,
} from '../../../models';
import { DefaultLayoutBuilder } from './default-layout.builder';

describe('DefaultLayoutBuilder', () => {
  let service: DefaultLayoutBuilder;

  beforeEach(() => {
    const testInjector = new Injector([
      {
        provide: 'LayoutBuilder',
        useClass: DefaultLayoutBuilder,
      },
    ]);

    service = testInjector.inject('LayoutBuilder');
  });

  it('should be provided?', () => {
    expect(service).toBeInstanceOf(DefaultLayoutBuilder);
  });

  describe('styles', () => {
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

    expectStyleRule('gap', '10px', 'gap:10px;');
    expectStyleRule('margin', '10px', 'margin:10px;');
    expectStyleRule('padding', '10px', 'padding:10px;');
    expectStyleRule('border', 'solid red 10px', 'border:solid red 10px;');
    expectStyleRule('radius', '10px', 'border-radius:10px;');
    expectStyleRule('background', 'red', 'background:red;');
    expectStyleRule('top', '10px', 'top:10px;');
    expectStyleRule('bottom', '10px', 'bottom:10px;');
    expectStyleRule('width', '50%', 'width:50%;flex:0 0 50%');
    expectStyleRule('height', '50%', '--height:50%');
    expectStyleRule('gridColSpan', '4', 'grid-column:span 4');
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
        beforeEach(() => populateLayout({ container: true }));
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
        beforeEach(() => populateLayout({ jumbotron: true }));
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
            populateLayout({ layout: CompositionLayout.column });
          });
          it(`should have a layout-column class`, () => {
            expect(layoutClasses).toContain('layout-column');
          });
          [1, 2, 3, 4].forEach((columnCount) => {
            describe(`and a column-count of ${columnCount} is also provided`, () => {
              beforeEach(() => {
                populateLayout({
                  layout: CompositionLayout.column,
                  columnCount,
                });
              });
              it(`should add a column-count-${columnCount} class`, () => {
                expect(layoutClasses).toContain(`column-count-${columnCount}`);
              });
            });
          });
        });

        describe(`when no layout is provided`, () => {
          beforeEach(() => {
            populateLayout({});
          });
          it(`should have a layout-column class`, () => {
            expect(layoutClasses).toBeUndefined();
          });
          [1, 2, 3, 4].forEach((columnCount) => {
            describe(`but a column-count of ${columnCount} is provided`, () => {
              beforeEach(() => {
                populateLayout({ columnCount });
              });
              it(`it should not add the column-count-${columnCount} class`, () => {
                expect(layoutClasses).toBeUndefined();
              });
            });
          });
        });

        describe(`when the layout is not column`, () => {
          beforeEach(() => {
            populateLayout({ layout: CompositionLayout.carousel });
          });
          it(`should not have a layout-column class`, () => {
            expect(layoutClasses).not.toContain('layout-column');
          });
        });
      });

      describe('carousel', () => {
        describe(`when the layout is carousel`, () => {
          beforeEach(() => {
            populateLayout({ layout: CompositionLayout.carousel });
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
            populateLayout({ layout: CompositionLayout.column });
          });
          it(`should not have a layout-carousel class`, () => {
            expect(layoutClasses).not.toContain('layout-carousel');
          });
        });
      });
    });

    describe('position', () => {
      describe('when a position is sticky', () => {
        beforeEach(() => populateLayout({ position: 'sticky' }));
        it('should add the sticky class', () => {
          expect(layoutClasses).toContain('sticky');
        });
      });
      describe('when an alternative position is provided', () => {
        beforeEach(() => populateLayout({ position: 'alternative' as any }));
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
