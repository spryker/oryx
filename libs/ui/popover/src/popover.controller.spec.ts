import { expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import * as sinon from 'sinon';
import { defaultPopoverOptions, PopoverComponent, PopoverController } from '.';

class CustomPopoverController extends PopoverController {
  test(): void {
    this.selected = 100;
    this.select(100);
  }
}
export class FakeComponent extends LitElement {
  popoverController = new CustomPopoverController(this);
  render(): TemplateResult {
    return html`
      <oryx-popover>
        <oryx-option>first</oryx-option>
        <oryx-option>second</oryx-option>
        <oryx-option>third</oryx-option>
        <oryx-option>four</oryx-option>
        <oryx-option>fifth</oryx-option>
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

describe('PopoverController', () => {
  let element: FakeComponent;

  const popover = (): PopoverComponent | null => {
    return element.renderRoot.querySelector('oryx-popover');
  };

  const expectOpen = (): void => {
    it('should show the popover', () => {
      expect(popover()?.hasAttribute('show')).to.be.true;
    });
  };

  const expectClose = (): void => {
    it('should hide popover', () => {
      expect(popover()?.hasAttribute('show')).to.be.false;
    });
  };

  const dispatchKeydown = (key: string): void => {
    element.dispatchEvent(
      new KeyboardEvent('keydown', {
        key,
        bubbles: true,
      })
    );
  };

  describe('with popover', () => {
    beforeEach(async () => {
      element = await fixture(html`<fake-popover></fake-popover>`);
      element.popoverController.options = defaultPopoverOptions;
    });

    describe('highlight', () => {
      describe('when the popover is shown', () => {
        beforeEach(() => {
          popover()?.toggleAttribute('show', true);
        });

        describe('and the first option is highlighted', () => {
          beforeEach(() => {
            popover()?.items[0].toggleAttribute('highlight', true);
          });

          describe('and the keydown with ArrowDown key is dispatch', () => {
            beforeEach(() => {
              dispatchKeydown('ArrowDown');
            });

            it('should no longer highlight the 1st option', () => {
              expect(popover()?.items[0]?.hasAttribute('highlight')).to.be
                .false;
            });

            it('should highlight the 2nd option', () => {
              expect(popover()?.items[1]?.hasAttribute('highlight')).to.be.true;
            });
          });
        });

        describe('and the last option is highlighted', () => {
          beforeEach(() => {
            popover()?.items[4].toggleAttribute('highlight', true);
          });

          describe('and the keydown with ArrowUp key is dispatch', () => {
            beforeEach(() => {
              dispatchKeydown('ArrowUp');
            });

            it('should no longer highlight the last option', () => {
              expect(popover()?.items[4]?.hasAttribute('highlight')).to.be
                .false;
            });

            it('should highlight the for last option', () => {
              expect(popover()?.items[3]?.hasAttribute('highlight')).to.be.true;
            });
          });
        });

        describe('and the 2nd option is selected', () => {
          beforeEach(() => {
            popover()?.items[1].toggleAttribute('selected', true);
            popover()?.items[1].toggleAttribute('highlight', true);
          });

          describe('and the keydown with ArrowDown key is dispatch', () => {
            beforeEach(() => {
              dispatchKeydown('ArrowDown');
            });

            it('should highlight the next option', () => {
              expect(popover()?.items[2]?.hasAttribute('highlight')).to.be.true;
            });

            describe('and when keydown with Enter key is dispatch', () => {
              beforeEach(() => dispatchKeydown('Enter'));

              it('should select the highlighted option', () => {
                expect(popover()?.items[2]?.hasAttribute('selected')).to.be
                  .true;
              });
            });
          });

          describe('and the keydown with ArrowUp key is dispatch', () => {
            beforeEach(() => {
              dispatchKeydown('ArrowUp');
            });

            it('should highlight the next option', () => {
              expect(popover()?.items[0]?.hasAttribute('highlight')).to.be.true;
            });

            describe('and when keydown with Enter key is dispatch', () => {
              beforeEach(() => dispatchKeydown('Enter'));

              it('should select the first option', () => {
                expect(popover()?.items[0]?.hasAttribute('selected')).to.be
                  .true;
              });
            });
          });
        });
      });

      describe('when the popover is closed', () => {
        describe('and an option is selected', () => {
          beforeEach(() => {
            popover()?.items?.[3].toggleAttribute('selected', true);
          });

          describe('and the keydown with ArrowDown key is dispatch', () => {
            beforeEach(() => {
              dispatchKeydown('ArrowDown');
            });
            it('should highlight the selected one', () => {
              expect(popover()?.items?.[3].hasAttribute('highlight')).to.be
                .true;
            });
          });

          describe('and the keydown with ArrowUp key is dispatch', () => {
            beforeEach(() => {
              dispatchKeydown('ArrowUp');
            });
            it('should highlight the selected one', () => {
              expect(popover()?.items?.[3].hasAttribute('highlight')).to.be
                .true;
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
          expectOpen();
        });

        describe('when the element is focussed', () => {
          beforeEach(() => {
            element.dispatchEvent(new Event('focusin', { bubbles: true }));
          });
          expectOpen();

          describe('and the page and component are blurred', () => {
            beforeEach(() => {
              window.dispatchEvent(new Event('blur', { bubbles: true }));
              element.dispatchEvent(new Event('focusout', { bubbles: true }));
            });

            describe('and the page is focused again', () => {
              beforeEach(() => {
                element.dispatchEvent(new Event('focusin', { bubbles: true }));
              });
              expectClose();
            });
          });
        });

        describe('and the showOnFocus is set to false', () => {
          beforeEach(() => {
            element.popoverController.options.showOnFocus = true;
            element.dispatchEvent(new Event('focusin', { bubbles: true }));
          });
          expectOpen();
        });

        describe('and the showOnFocus is set to false', () => {
          beforeEach(() => {
            element.popoverController.options.showOnFocus = false;
            element.dispatchEvent(new Event('focusin', { bubbles: true }));
          });
          expectClose();
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

        expectOpen();

        describe('and the mouseup event is dispatched before 300ms', () => {
          beforeEach(() => {
            clock.tick(300 - 10);
            element.dispatchEvent(new Event('mouseup', { bubbles: true }));
          });
          expectOpen();
        });

        describe('and the mouseup event is dispatched after 300ms', () => {
          beforeEach(() => {
            clock.tick(300 + 1);
            element.dispatchEvent(new Event('mouseup', { bubbles: true }));
          });
          expectClose();
        });

        describe('when the popover is open', () => {
          beforeEach(() => {
            element.toggleAttribute('show', true);
          });

          describe('when the focusout is dispatched on the host', () => {
            beforeEach(() => {
              element.dispatchEvent(new Event('focusout', { bubbles: true }));
            });
            expectClose();
          });
        });
      });

      describe('when the input is dispatched on the host', () => {
        beforeEach(() => {
          element.dispatchEvent(new Event('input', { bubbles: true }));
        });
        expectOpen();
      });

      describe('when the keydown is dispatched on the host', () => {
        describe('and the key is "ArrowDown"', () => {
          describe('and the popover is closed', () => {
            beforeEach(() => {
              dispatchKeydown('ArrowDown');
            });

            expectOpen();

            it('should highlight the first option', () => {
              expect(popover()?.items?.[0]?.hasAttribute('highlight')).to.be
                .true;
            });
          });
        });

        describe('and the key is "ArrowUp"', () => {
          describe('and the highlight < 0', () => {
            beforeEach(() => {
              dispatchKeydown('ArrowUp');
            });

            expectOpen();
          });

          describe('and the last item is highlighted', () => {
            beforeEach(() => {
              popover()?.items?.[4];
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
                expectClose();
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
                expectOpen();
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
          expectClose();
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

  const expectNoErrorOnDispatch = (event: string, key?: string): void => {
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
    expectNoErrorOnDispatch('focusin');
    expectNoErrorOnDispatch('mousedown');
    expectNoErrorOnDispatch('mouseup');
    expectNoErrorOnDispatch('keydown', 'ArrowDown');
    expectNoErrorOnDispatch('keydown', 'ArrowUp');
    expectNoErrorOnDispatch('keydown', 'Enter');
    expectNoErrorOnDispatch('keydown', ' ');
    expectNoErrorOnDispatch('keydown', 'Escape');
    expectNoErrorOnDispatch('focusout');

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
    expectNoErrorOnDispatch('focusin');
    expectNoErrorOnDispatch('mousedown');
    expectNoErrorOnDispatch('mouseup');
    expectNoErrorOnDispatch('keydown', 'ArrowDown');
    expectNoErrorOnDispatch('keydown', 'ArrowUp');
    expectNoErrorOnDispatch('keydown', 'Enter');
    expectNoErrorOnDispatch('keydown', ' ');
    expectNoErrorOnDispatch('keydown', 'Escape');
    expectNoErrorOnDispatch('focusout');
  });
});
