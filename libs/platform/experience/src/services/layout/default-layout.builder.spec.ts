import { App, AppRef } from '@spryker-oryx/core';
import { Injector } from '@spryker-oryx/di';
import { Size } from '@spryker-oryx/utilities';
import {
  CompositionProperties,
  LayoutAlign,
  StyleProperties,
} from '../../models';
import { Theme, ThemePlugin } from '../../plugins';
import { Component } from '../experience';
import { DefaultLayoutBuilder } from './default-layout.builder';
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

class MockScreenService implements Partial<ScreenService> {
  getScreenMedia = vi.fn();
}

describe('DefaultLayoutBuilder', () => {
  let service: DefaultLayoutBuilder;
  let screenService: MockScreenService;

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
        useClass: MockScreenService,
      },
    ]);

    service = testInjector.inject('LayoutBuilder');
    screenService = testInjector.inject<MockScreenService>(ScreenService);
  });

  it('should be provided?', () => {
    expect(service).toBeInstanceOf(DefaultLayoutBuilder);
  });

  describe('collectStyles', () => {
    let styles: string;

    describe('when there are not options', () => {
      beforeEach(() => {
        styles = service.collectStyles([
          {
            id: 'test',
            type: 'banner',
            options: {
              data: {
                rules: [{}],
              },
            },
          },
        ]);
      });

      it('should not generate empty styles', () => {
        expect(styles).toBe(``);
      });
    });

    describe('when there are style options', () => {
      describe('and there is no id', () => {
        beforeEach(() => {
          styles = service.collectStyles([
            {
              type: 'banner',
              options: {
                data: {
                  rules: [{ background: 'red' }],
                },
              },
            },
          ] as Component<CompositionProperties>[]);
        });

        it('should generate the style rules', () => {
          expect(styles).toBe(`:host {\nbackground: red\n}`);
        });
      });

      describe('and there is an id', () => {
        beforeEach(() => {
          styles = service.collectStyles([
            {
              id: 'test',
              type: 'banner',
              options: {
                data: {
                  rules: [{ background: 'red' }],
                },
              },
            },
          ]);
        });

        it('should generate the style rules', () => {
          expect(styles).toBe(
            `:host([uid="test"]), [uid="test"] {\nbackground: red\n}`
          );
        });
      });
    });

    describe('when there is a media query', () => {
      beforeEach(() => {
        screenService.getScreenMedia.mockReturnValue('@media foo');
        styles = service.collectStyles([
          {
            id: 'test',
            type: 'banner',
            options: {
              data: {
                rules: [{ query: { breakpoint: Size.Md }, background: 'red' }],
              },
            },
          },
        ]);
      });

      it('should call getScreenMedia', () => {
        expect(screenService.getScreenMedia).toHaveBeenCalledWith(Size.Md);
      });

      it('should generate a media query', () => {
        expect(styles).toBe(
          `@media foo{\n:host([uid="test"]), [uid="test"] {\nbackground: red\n}}`
        );
      });
    });

    describe('when the query targets the children', () => {
      beforeEach(() => {
        styles = service.collectStyles([
          {
            id: 'test',
            type: 'banner',
            options: {
              data: {
                rules: [{ query: { childs: true }, background: 'red' }],
              },
            },
          },
        ]);
      });

      it('should call getScreenMedia', () => {
        expect(screenService.getScreenMedia).not.toHaveBeenCalled();
      });

      it('should generate a selector for child elements', () => {
        expect(styles).toBe(
          `:host([uid="test"]) > *, [uid="test"] > * {\nbackground: red\n}`
        );
      });
    });

    describe('when the query targets the hover event', () => {
      beforeEach(() => {
        styles = service.collectStyles([
          {
            id: 'test',
            type: 'banner',
            options: {
              data: {
                rules: [{ query: { hover: true }, background: 'red' }],
              },
            },
          },
        ]);
      });

      it('should call getScreenMedia', () => {
        expect(screenService.getScreenMedia).not.toHaveBeenCalled();
      });

      it('should generate a selector for child elements', () => {
        expect(styles).toBe(
          `:host([uid="test"]):hover, [uid="test"]:hover {\nbackground: red\n}`
        );
      });
    });
  });

  describe('style properties', () => {
    expectStyleRule({ columnCount: 6 }, '--oryx-column-count: 6');
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
    expectStyleRule({ justify: LayoutAlign.Center }, '--justify: center');
    expectStyleRule({ justify: LayoutAlign.Start }, '--justify: start');
    expectStyleRule({ justify: LayoutAlign.Stretch }, '--justify: stretch');
    expectStyleRule({ justify: LayoutAlign.End }, '--justify: end');
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
    expectStyleRule({ fill: 'red' }, '--oryx-fill: red');
    expectStyleRule({ ratio: '1/4' }, 'aspect-ratio: 1/4');
    expectStyleRule({ zIndex: 3 }, 'z-index: 3');
    expectStyleRule({ rotate: 3 }, 'rotate: 3deg');
    expectStyleRule({ rotate: -2 }, 'rotate: -2deg');
    expectStyleRule({ overflow: 'auto' }, 'overflow: auto');
  });

  describe('classes', () => {
    let layoutClasses: string | undefined;

    ['vertical', 'bleed', 'overlap', 'sticky', 'divider'].forEach((prop) => {
      describe(`when ${prop} is configured`, () => {
        beforeEach(() => {
          layoutClasses = service.getLayoutClasses({
            rules: [{ [prop]: true }],
          });
        });

        it(`should add the ${prop} class`, () => {
          expect(layoutClasses).toContain(prop);
        });
      });

      [Size.Xs, Size.Sm, Size.Md, Size.Lg, Size.Xl].forEach((size) => {
        describe(`when ${prop} is configured for ${size}`, () => {
          beforeEach(() => {
            layoutClasses = service.getLayoutClasses({
              rules: [{ [prop]: true, query: { breakpoint: size } }],
            });
          });

          it(`should add the ${size}-${prop} class`, () => {
            expect(layoutClasses).toContain(`${size}-${prop}`);
          });
        });
      });

      describe(`when ${prop} is not configured`, () => {
        beforeEach(() => {
          layoutClasses = service.getLayoutClasses({});
        });

        it(`should not add the ${prop} class`, () => {
          expect(layoutClasses).toBeUndefined();
        });
      });
    });
  });
});
