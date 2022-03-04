import { defaultPopoverOptions, PopoverComponent, PopoverController } from '.';
import '../../option';
import { OptionComponent } from '../../option';
import { expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import * as sinon from 'sinon';

class CustomPopoverController extends PopoverController {
  test(): void {
    this.selected = 100;
    this.select(100);
  }

  // helper method for test
  deselect(): void {
    super.deselect();
  }
}
export class FakeComponent extends LitElement {
  popoverController = new CustomPopoverController(this);
  render(): TemplateResult {
    return html`
      <oryx-popover>
        <slot></slot>
      </oryx-popover>
    `;
  }

  public testCustomController(): void {
    this.popoverController.test();
  }
}
customElements.define('fake-popover', FakeComponent);

export class NoPopoverComponent extends FakeComponent {
  render(): TemplateResult {
    return html`no popover`;
  }
}
customElements.define('no-popover', NoPopoverComponent);

const items = (host: HTMLElement): OptionComponent[] => {
  return Array.from(host.querySelectorAll('oryx-option'));
};

describe('PopoverController', () => {
  let element: FakeComponent;

  const popover = (): PopoverComponent | null => {
    return element.renderRoot.querySelector('oryx-popover');
  };

  const expectPopOverToBeOpen = (): void => {
    it('should show the popover', () => {
      expect(popover()?.hasAttribute('show')).to.be.true;
    });
  };

  const expectPopOverToBeClosed = (): void => {
    it('should hide popover', () => {
      expect(popover()?.hasAttribute('show')).to.be.false;
    });
  };

  const dispatchKeydown = (key: string, metaKey = false): void => {
    element.dispatchEvent(
      new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        metaKey,
      })
    );
  };

  describe('with popover', () => {
    beforeEach(async () => {
      element = await fixture(html`<fake-popover>
        ${[...Array(25)].map(
          (_, index) => html`<oryx-option>${index + 1}</oryx-option>`
        )}
      </fake-popover>`);
      element.popoverController.options = defaultPopoverOptions;
    });

    describe('highlight', () => {
      const expectElementHighLight = (highlight: number): void => {
        items(element).forEach((item, index) => {
          if (index === highlight) {
            expect(item.hasAttribute('highlight')).to.be.true;
          } else {
            expect(item.hasAttribute('highlight')).to.be.false;
          }
        });
      };

      describe('when the popover is shown', () => {
        beforeEach(() => {
          popover()?.toggleAttribute('show', true);
        });

        describe('and the first option is highlighted', () => {
          beforeEach(() => {
            items(element)[0].toggleAttribute('highlight', true);
          });

          describe('"ArrowDown" key', () => {
            describe('and the keydown with ArrowDown key is dispatch', () => {
              beforeEach(() => {
                dispatchKeydown('ArrowDown');
              });

              it('should highlight the 2nd option', () => {
                expectElementHighLight(1);
              });
            });
          });

          describe('and the keydown+meta key is dispatch', () => {
            beforeEach(() => {
              dispatchKeydown('ArrowDown', true);
            });
            it('should move highlight the highlight to the 10th position', () => {
              expectElementHighLight(10);
            });
          });

          describe('and the keydown+meta key is dispatch twice', () => {
            beforeEach(() => {
              dispatchKeydown('ArrowDown', true);
              dispatchKeydown('ArrowDown', true);
            });
            it('should move highlight the highlight to the 20th position', () => {
              expectElementHighLight(20);
            });
          });

          describe('and the keydown+meta key is dispatch more then 2 times', () => {
            beforeEach(() => {
              dispatchKeydown('ArrowDown', true);
              dispatchKeydown('ArrowDown', true);
              dispatchKeydown('ArrowDown', true);
              dispatchKeydown('ArrowDown', true);
            });
            it('should move highlight the highlight to the last position', () => {
              expectElementHighLight(24);
            });
          });
        });

        describe('"PageDown" key', () => {
          describe('and the keydown is dispatch', () => {
            beforeEach(() => {
              dispatchKeydown('PageDown');
            });
            it('should move the highlight the 10th option', () => {
              expectElementHighLight(9);
            });
          });

          describe('and the keydown is dispatch twice', () => {
            beforeEach(() => {
              dispatchKeydown('PageDown');
              dispatchKeydown('PageDown');
            });
            it('should move the highlight the 20th option', () => {
              expectElementHighLight(19);
            });
          });

          describe('and the keydown is dispatch more then 2 times', () => {
            beforeEach(() => {
              dispatchKeydown('PageDown');
              dispatchKeydown('PageDown');
              dispatchKeydown('PageDown');
              dispatchKeydown('PageDown');
              dispatchKeydown('PageDown');
            });
            it('should move the highlight the last option', () => {
              expectElementHighLight(24);
            });
          });
        });

        describe('"End" key', () => {
          describe('and the keydown is dispatch', () => {
            beforeEach(() => {
              dispatchKeydown('End');
            });
            it('should move the highlight to the last position', () => {
              expectElementHighLight(items(element).length - 1);
            });
          });

          describe('and the keydown is dispatch multiple times', () => {
            beforeEach(() => {
              dispatchKeydown('End');
              dispatchKeydown('End');
              dispatchKeydown('End');
            });
            it('should keep the highlight at the last position', () => {
              expectElementHighLight(items(element).length - 1);
            });
          });
        });

        describe('and the last option is highlighted', () => {
          beforeEach(() => {
            items(element)[24].toggleAttribute('highlight', true);
          });

          describe('"ArrowUp" key', () => {
            describe('and the keydown is dispatch', () => {
              beforeEach(() => {
                dispatchKeydown('ArrowUp');
              });

              it('should move the highlight to the last option', () => {
                expectElementHighLight(23);
              });
            });

            describe('and the keydown+metaKey is dispatch', () => {
              beforeEach(() => {
                dispatchKeydown('ArrowUp', true);
              });

              it('should move the highlight 10 positions up', () => {
                expectElementHighLight(14);
              });
            });

            describe('and the keydown+metaKey is dispatch twice', () => {
              beforeEach(() => {
                dispatchKeydown('ArrowUp', true);
                dispatchKeydown('ArrowUp', true);
              });

              it('should move the highlight 10 positions up', () => {
                expectElementHighLight(4);
              });
            });
          });

          describe('and the keydown+metaKey is dispatch more than 2 times', () => {
            beforeEach(() => {
              dispatchKeydown('ArrowUp', true);
              dispatchKeydown('ArrowUp', true);
              dispatchKeydown('ArrowUp', true);
              dispatchKeydown('ArrowUp', true);
              dispatchKeydown('ArrowUp', true);
            });

            it('should keep the highlight at the 1st position', () => {
              expectElementHighLight(0);
            });
          });

          describe('"PageUp" key', () => {
            describe('and the keydown is dispatch', () => {
              beforeEach(() => {
                dispatchKeydown('PageUp');
              });

              it('should move the highlight 10 positions up', () => {
                expectElementHighLight(14);
              });
            });

            describe('and the keydown is dispatch twice', () => {
              beforeEach(() => {
                dispatchKeydown('PageUp');
                dispatchKeydown('PageUp');
              });
              it('should move the highlight 20 positions up', () => {
                expectElementHighLight(4);
              });
            });

            describe('and the keydown is dispatch more then 2 times', () => {
              beforeEach(() => {
                dispatchKeydown('PageUp');
                dispatchKeydown('PageUp');
                dispatchKeydown('PageUp');
                dispatchKeydown('PageUp');
                dispatchKeydown('PageUp');
              });
              it('should keep the highlight at the 1st position', () => {
                expectElementHighLight(0);
              });
            });
          });

          describe('"Home" key', () => {
            describe('and dropdown key is dispatch', () => {
              beforeEach(() => {
                dispatchKeydown('Home');
              });

              it('should move the highlight to the first option', () => {
                expectElementHighLight(0);
              });
            });

            describe('and dropdown key is dispatch multiple times', () => {
              beforeEach(() => {
                dispatchKeydown('Home');
                dispatchKeydown('Home');
                dispatchKeydown('Home');
              });

              it('should keep the highlight at the first option', () => {
                expectElementHighLight(0);
              });
            });
          });
        });

        describe('and the 2nd option is selected', () => {
          beforeEach(() => {
            items(element)[1].toggleAttribute('selected', true);
            items(element)[1].toggleAttribute('highlight', true);
          });

          describe('and the keydown with ArrowDown key is dispatch', () => {
            beforeEach(() => {
              dispatchKeydown('ArrowDown');
            });

            it('should highlight the next option', () => {
              expect(items(element)[2]?.hasAttribute('highlight')).to.be.true;
            });

            describe('and when keydown with Enter key is dispatch', () => {
              beforeEach(() => dispatchKeydown('Enter'));

              it('should select the highlighted option', () => {
                expect(items(element)[2]?.hasAttribute('selected')).to.be.true;
              });
            });
          });

          describe('and the keydown with ArrowUp key is dispatch', () => {
            beforeEach(() => {
              dispatchKeydown('ArrowUp');
            });

            it('should highlight the next option', () => {
              expect(items(element)[0]?.hasAttribute('highlight')).to.be.true;
            });

            describe('and when keydown with Enter key is dispatch', () => {
              beforeEach(() => dispatchKeydown('Enter'));

              it('should select the first option', () => {
                expect(items(element)[0]?.hasAttribute('selected')).to.be.true;
              });
            });
          });
        });
      });

      describe('when the popover is closed', () => {
        describe('and an option is selected', () => {
          beforeEach(() => {
            items(element)[3].toggleAttribute('selected', true);
          });

          describe('and the keydown with ArrowDown key is dispatch', () => {
            beforeEach(() => {
              dispatchKeydown('ArrowDown');
            });
            it('should highlight the selected one', () => {
              expect(items(element)[3].hasAttribute('highlight')).to.be.true;
            });
          });

          describe('and the keydown with ArrowUp key is dispatch', () => {
            beforeEach(() => {
              dispatchKeydown('ArrowUp');
            });
            it('should highlight the selected one', () => {
              expect(items(element)[3].hasAttribute('highlight')).to.be.true;
            });
          });
        });
      });
    });

    describe('events', () => {
      describe('when the focusin is dispatched on the host', () => {
        describe('and the showOnFocus is not set', () => {
          beforeEach(() => {
            element.dispatchEvent(new Event('focusin', { bubbles: true }));
          });
          expectPopOverToBeOpen();
        });

        describe('when the element is focussed', () => {
          beforeEach(() => {
            element.dispatchEvent(new Event('focusin', { bubbles: true }));
          });
          expectPopOverToBeOpen();

          describe('and the page and component are blurred', () => {
            beforeEach(() => {
              window.dispatchEvent(new Event('blur', { bubbles: true }));
              element.dispatchEvent(new Event('focusout', { bubbles: true }));
            });

            describe('and the page is focused again', () => {
              beforeEach(() => {
                element.dispatchEvent(new Event('focusin', { bubbles: true }));
              });
              expectPopOverToBeClosed();
            });
          });
        });

        describe('and the showOnFocus is set to false', () => {
          beforeEach(() => {
            element.popoverController.options.showOnFocus = true;
            element.dispatchEvent(new Event('focusin', { bubbles: true }));
          });
          expectPopOverToBeOpen();
        });

        describe('and the showOnFocus is set to false', () => {
          beforeEach(() => {
            element.popoverController.options.showOnFocus = false;
            element.dispatchEvent(new Event('focusin', { bubbles: true }));
          });
          expectPopOverToBeClosed();
        });

        describe('and the control is empty', () => {
          beforeEach(async () => {
            element = await fixture(html`<fake-popover>
              <input />
            </fake-popover>`);
          });
          beforeEach(() => {
            element.popoverController.options.showOnFocus = true;
            element.dispatchEvent(new Event('focusin', { bubbles: true }));
          });

          expectPopOverToBeClosed();
        });

        describe('and the control is not empty', () => {
          beforeEach(async () => {
            element = await fixture(html`<fake-popover>
              <input value="bar" />
            </fake-popover>`);
          });
          beforeEach(() => {
            element.popoverController.options.showOnFocus = true;
            element.dispatchEvent(new Event('focusin', { bubbles: true }));
          });

          expectPopOverToBeOpen();
        });
      });

      describe('when the mousedown is dispatched on the host', () => {
        let clock: sinon.SinonFakeTimers;

        beforeEach(() => {
          clock = sinon.useFakeTimers();
          element.dispatchEvent(new Event('mousedown', { bubbles: true }));
        });

        afterEach(() => {
          sinon.restore();
        });

        expectPopOverToBeOpen();

        describe('and the mouseup event is dispatched before 300ms', () => {
          beforeEach(() => {
            clock.tick(300 - 10);
            element.dispatchEvent(new Event('mouseup', { bubbles: true }));
          });
          expectPopOverToBeOpen();
        });

        describe('and the mouseup event is dispatched after 300ms', () => {
          beforeEach(() => {
            clock.tick(300 + 1);
            element.dispatchEvent(new Event('mouseup', { bubbles: true }));
          });
          expectPopOverToBeClosed();
        });

        describe('when the popover is open', () => {
          beforeEach(() => {
            element.toggleAttribute('show', true);
          });

          describe('when the focusout is dispatched on the host', () => {
            beforeEach(() => {
              element.dispatchEvent(new Event('focusout', { bubbles: true }));
            });
            expectPopOverToBeClosed();
          });
        });
      });

      describe('when the input is dispatched on the host', () => {
        beforeEach(() => {
          element.dispatchEvent(new Event('input', { bubbles: true }));
        });
        expectPopOverToBeOpen();

        describe('and the input has no value', () => {
          beforeEach(async () => {
            element = await fixture(html`<fake-popover>
              <input />
            </fake-popover>`);
          });
          beforeEach(() => {
            element.dispatchEvent(new Event('input', { bubbles: true }));
          });

          expectPopOverToBeClosed();
        });
      });

      describe('when the keydown is dispatched on the host', () => {
        describe('and the key is "ArrowDown"', () => {
          describe('and the popover is closed', () => {
            beforeEach(() => {
              dispatchKeydown('ArrowDown');
            });

            expectPopOverToBeOpen();

            it('should highlight the first option', () => {
              expect(items(element)[0]?.hasAttribute('highlight')).to.be.true;
            });
          });
        });

        describe('and the key is "ArrowUp"', () => {
          describe('and the highlight < 0', () => {
            beforeEach(() => {
              dispatchKeydown('ArrowUp');
            });

            expectPopOverToBeOpen();
          });

          describe('and the last item is highlighted', () => {
            beforeEach(() => {
              items(element)[4];
              dispatchKeydown('ArrowUp');
            });
          });
        });

        ['Enter', ' '].forEach((key) => {
          describe(`and the key is "${key}"`, () => {
            describe('when the popover is shown', () => {
              beforeEach(() => {
                popover()?.toggleAttribute('show', true);
              });
              describe(`and the key is "${key}"`, () => {
                beforeEach(() => {
                  dispatchKeydown(key);
                });
                expectPopOverToBeClosed();
              });
            });

            describe('when the popover is hidden', () => {
              beforeEach(() => {
                popover()?.removeAttribute('show');
              });
              describe(`and the key is "${key}"`, () => {
                beforeEach(() => {
                  dispatchKeydown(key);
                });
                expectPopOverToBeOpen();
              });
            });
          });
        });

        describe('and the key is Escape', () => {
          beforeEach(() => {
            element.dispatchEvent(
              new KeyboardEvent('keydown', {
                key: 'Escape',
                bubbles: true,
              })
            );
          });
          expectPopOverToBeClosed();
        });

        '12345abcdef'.split('').forEach((key) => {
          describe(`and the key is "${key}"`, () => {
            it('should stop immediate propagation of the event', () => {
              const event = new KeyboardEvent('keydown', {
                key,
                bubbles: true,
              });
              const expectation = sinon
                .mock(event)
                .expects('stopImmediatePropagation')
                .once();
              element?.dispatchEvent(event);
              expectation.verify();
            });
          });
        });
      });
    });

    describe('scrollIntoView', () => {
      let clock: sinon.SinonFakeTimers;
      let option: OptionComponent | null;

      beforeEach(() => {
        clock = sinon.useFakeTimers();
      });

      afterEach(() => {
        clock.restore();
      });
      beforeEach(async () => {
        element = await fixture(html`<fake-popover>
          <oryx-option>first</oryx-option>
          <oryx-option selected highlight>second</oryx-option>
        </fake-popover>`);
        option = element.querySelector('oryx-option[selected]');
      });
      describe('when an item is selected', () => {
        beforeEach(async () => {
          if (option) {
            sinon.spy(option, 'scrollIntoView');
          }
          element.dispatchEvent(
            new Event('input', { bubbles: true, composed: true })
          );
        });

        it('should not trigger scrollIntoView when the popup is shown', () => {
          expect(option?.scrollIntoView).to.have.not.been.called;
        });

        describe('and when 300ms have passed', () => {
          beforeEach(() => {
            clock.tick(300);
          });

          it('should trigger scrollIntoView when the popup is shown', () => {
            expect(option?.scrollIntoView).to.have.been.called;
          });
        });

        describe('and when 300ms have passed', () => {
          describe('and the selection is no longer available', () => {
            beforeEach(() => {
              element.popoverController.deselect();
              clock.tick(300);
            });

            it('should not trigger scrollIntoView when the popup is shown', () => {
              expect(option?.scrollIntoView).to.have.not.been.called;
            });
          });
        });
      });
    });

    describe('when PopoverController is extended', () => {
      describe('and methods are called without guarding', () => {
        beforeEach(() => element.testCustomController());
        it('should not throw an error', () => {
          expect(() => {
            (): void => undefined;
          }).not.to.throw;
        });
      });
    });

    const testNoErrorOnDispatch = (event: string, key?: string): void => {
      describe(`and the ${event} is dispatched`, () => {
        beforeEach(() => {
          key
            ? element?.dispatchEvent(
                new KeyboardEvent(event, {
                  key,
                  bubbles: true,
                  composed: true,
                })
              )
            : element?.dispatchEvent(
                new Event(event, { bubbles: true, composed: true })
              );
        });
        it('should not throw an error', () => {
          if (element) {
            expect(() => {
              (): void => undefined;
            }).not.to.throw;
          }
        });
      });
    };

    describe('when there is no popover', () => {
      beforeEach(
        async () => (element = await fixture(html`<no-popover></no-popover>`))
      );
      testNoErrorOnDispatch('focusin');
      testNoErrorOnDispatch('mousedown');
      testNoErrorOnDispatch('mouseup');
      testNoErrorOnDispatch('keydown', 'ArrowDown');
      testNoErrorOnDispatch('keydown', 'ArrowUp');
      testNoErrorOnDispatch('keydown', 'Enter');
      testNoErrorOnDispatch('keydown', ' ');
      testNoErrorOnDispatch('keydown', 'Escape');
      testNoErrorOnDispatch('focusout');

      describe('when PopoverController is extended', () => {
        describe('and methods are called without guarding', () => {
          beforeEach(() =>
            (element as NoPopoverComponent).testCustomController()
          );
          it('should not throw an error', () => {
            expect(() => {
              (): void => undefined;
            }).not.to.throw;
          });
        });
      });
    });

    describe('when there are no items', () => {
      beforeEach(async () => {
        element = await fixture(html`<no-items></no-items>`);
      });
      testNoErrorOnDispatch('focusin');
      testNoErrorOnDispatch('mousedown');
      testNoErrorOnDispatch('mouseup');
      testNoErrorOnDispatch('keydown', 'ArrowDown');
      testNoErrorOnDispatch('keydown', 'ArrowUp');
      testNoErrorOnDispatch('keydown', 'Enter');
      testNoErrorOnDispatch('keydown', ' ');
      testNoErrorOnDispatch('keydown', 'Escape');
      testNoErrorOnDispatch('focusout');
    });

    describe('handleChange', () => {
      const expectChangeEvent = (): void => {
        it('should not throw an error', () => {
          popover()?.dispatchEvent(
            new Event('change', { bubbles: true, composed: true })
          );
          expect(() => {
            (): void => undefined;
          }).not.to.throw;
        });
      };

      describe('when a change event is dispatched', () => {
        describe('with items', () => {
          beforeEach(async () => {
            element = await fixture(html`<fake-popover>
              <input value="first" />
              <oryx-option value="first">first</oryx-option>
              <oryx-option>second</oryx-option>
            </fake-popover>`);
            element.popoverController.options = defaultPopoverOptions;
          });
          expectChangeEvent();
        });

        describe('without items', () => {
          beforeEach(async () => {
            element = await fixture(html`<fake-popover>
              <input value="value" />
            </fake-popover>`);
            element.popoverController.options = defaultPopoverOptions;
          });

          expectChangeEvent();
        });

        describe('when not selectable', () => {
          beforeEach(async () => {
            element = await fixture(html`<fake-popover>
              <input value="first" />
              <oryx-option value="first">first</oryx-option>
              <oryx-option>second</oryx-option>
            </fake-popover>`);
            element.popoverController.options = {
              selectable: false,
            };
          });

          expectChangeEvent();
        });
      });
    });
  });
});
