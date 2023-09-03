import { getShadowElementBySelector } from '@/tools/testing';
import { fixture, html } from '@open-wc/testing-helpers';
import { a11yConfig, i18n, useComponent } from '@spryker-oryx/utilities';
import { TemplateResult } from 'lit';
import { getControl } from '../../utilities/getControl';
import { PasswordInputComponent } from './password-input.component';
import { passwordInputComponent } from './password-input.def';
import { PasswordVisibilityStrategy } from './password-input.model';

describe('PasswordComponent', () => {
  let element: PasswordInputComponent;

  beforeAll(async () => {
    await useComponent(passwordInputComponent);
  });

  describe('when the password control is rendered', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-password-input>
          <input type="password" aria-label="password" />
        </oryx-password-input>`
      );
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should have an input with password type', () => {
      expect(getControl(element).getAttribute('type')).toBe('password');
    });
  });

  describe('visibility strategies', () => {
    let toggle: HTMLButtonElement | undefined | null;

    const render = (
      strategy: PasswordVisibilityStrategy
    ): TemplateResult => html`<oryx-password-input
      ?filter=${true}
      .strategy=${strategy}
    >
      <input type="password" aria-label="password" />
    </oryx-password-input>`;

    const expectAfterEvent = (event: string): void => {
      it('should make the password visible', () => {
        toggle?.dispatchEvent(new MouseEvent(event, { bubbles: true }));
        expect(element.querySelector('input')?.getAttribute('type')).toBe(
          'text'
        );
      });
    };

    const expectNotAfterEvent = (event: string): void => {
      it('should not make the password visible', () => {
        toggle?.dispatchEvent(new MouseEvent(event, { bubbles: true }));
        expect(element.querySelector('input')?.getAttribute('type')).not.toBe(
          'text'
        );
      });
    };

    describe('when the strategy is set to NONE', () => {
      beforeEach(async () => {
        element = await fixture(render(PasswordVisibilityStrategy.None));
        toggle = getShadowElementBySelector(
          element,
          'oryx-icon'
        ) as HTMLButtonElement;
      });

      it('should pass the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should not have a button to make the password visible', () => {
        expect(toggle).toBeNull();
      });

      it('should have an input with password type', () => {
        expect(element.querySelector('input')?.getAttribute('type')).toBe(
          'password'
        );
      });
    });

    describe('when the strategy is set to CLICK', () => {
      beforeEach(async () => {
        element = await fixture(render(PasswordVisibilityStrategy.Click));
        toggle = getShadowElementBySelector(
          element,
          'oryx-icon'
        ) as HTMLButtonElement;
      });

      it('should pass the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      describe('and when the element is clicked', () => {
        expectAfterEvent('click');
      });

      describe('and when the mousedown is triggered', () => {
        expectNotAfterEvent('mousedown');
      });

      describe('and when the mouseover is triggered', () => {
        expectNotAfterEvent('mouseover');
      });

      describe('and when the mouseover is triggered twice', () => {
        it('should make the password visible', () => {
          toggle?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          toggle?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          expect(element.querySelector('input')?.getAttribute('type')).not.toBe(
            'text'
          );
        });
      });
    });

    describe('when the strategy is set to MOUSEDOWN', () => {
      beforeEach(async () => {
        element = await fixture(render(PasswordVisibilityStrategy.Mousedown));
        toggle = getShadowElementBySelector(
          element,
          'oryx-icon'
        ) as HTMLButtonElement;
      });
      it('should have a button', () => {
        expect(toggle).not.toBeNull();
      });

      describe('and when the element is clicked', () => {
        expectNotAfterEvent('click');
      });

      describe('and when the mousedown is triggered', () => {
        expectAfterEvent('mousedown');
      });

      describe('and when the mouseover is triggered', () => {
        expectNotAfterEvent('mouseover');
      });
    });

    describe('when the strategy is set to MOUSEOVER', () => {
      beforeEach(async () => {
        element = await fixture(render(PasswordVisibilityStrategy.Hover));
        toggle = getShadowElementBySelector(
          element,
          'oryx-icon'
        ) as HTMLButtonElement;
      });

      it('should pass the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      describe('and when the element is clicked', () => {
        expectNotAfterEvent('click');
      });

      describe('and when the mousedown is triggered', () => {
        expectNotAfterEvent('mousedown');
      });

      describe('and when the mouseover is triggered', () => {
        expectAfterEvent('mouseover');
      });
    });

    describe('when the strategy is set to CLICK', () => {
      describe('and a timeout is set to 10ms', () => {
        beforeEach(async () => {
          vi.useFakeTimers();
          element = await fixture(
            html`<oryx-password-input
              .strategy=${PasswordVisibilityStrategy.Click}
              .timeout=${10}
            >
              <input type="password" aria-label="password" />
            </oryx-password-input>`
          );
          toggle = getShadowElementBySelector(
            element,
            'oryx-icon'
          ) as HTMLButtonElement;
          toggle?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        afterEach(() => {
          vi.clearAllTimers();
        });

        describe('when 9ms has passed', () => {
          beforeEach(() => {
            vi.advanceTimersByTime(9);
          });

          it('should still show the password', () => {
            expect(element.querySelector('input')?.getAttribute('type')).toBe(
              'text'
            );
          });
        });

        describe('when 10ms has passed', () => {
          beforeEach(() => {
            vi.advanceTimersByTime(10);
          });

          it('should no longer show the password', () => {
            expect(element.querySelector('input')?.getAttribute('type')).toBe(
              'password'
            );
          });
        });
      });
    });
  });

  describe('validation', () => {
    describe('when the minLength is set', () => {
      const minLength = 8;

      beforeEach(async () => {
        element = await fixture(
          html`<oryx-password-input minLength=${minLength}>
            <input type="password" aria-label="password" />
          </oryx-password-input>`
        );
      });

      it('should render inactive validation messages', () => {
        expect(
          element.renderRoot.querySelector('.validation-message')?.textContent
        ).toContain(
          i18n('ui.password.validation.at-least-<count>-characters', {
            count: minLength,
          })
        );

        expect(element).not.toContainElement('.validation-message .active');
      });

      describe('and the password is shorter than the minLength', () => {
        beforeEach(() => {
          getControl(element).value = 'abcdefg';
          getControl(element).dispatchEvent(
            new Event('input', {
              bubbles: true,
            })
          );
        });

        it('should render inactive validation messages', () => {
          expect(
            element.renderRoot.querySelector('.validation-message')?.textContent
          ).toContain(
            i18n('ui.password.validation.at-least-<count>-characters', {
              count: minLength,
            })
          );

          expect(element).not.toContainElement('.validation-message .active');
        });
      });

      describe('and the password is longer than the minLength', () => {
        beforeEach(() => {
          getControl(element).value = 'abcdefgh';
          getControl(element).dispatchEvent(
            new InputEvent('input', {
              bubbles: true,
            })
          );
        });

        it('should render active validation messages', () => {
          expect(
            element.renderRoot.querySelector('.validation-message.active')
              ?.textContent
          ).toContain(
            i18n('ui.password.validation.at-least-<count>-characters', {
              count: minLength,
            })
          );
        });
      });
    });

    describe('when the maxLength is set', () => {
      const maxLength = 8;

      beforeEach(async () => {
        element = await fixture(
          html`<oryx-password-input maxLength=${maxLength}>
            <input type="password" aria-label="password" />
          </oryx-password-input>`
        );
      });

      it('should render inactive validation messages', () => {
        expect(
          element.renderRoot.querySelector('.validation-message')?.textContent
        ).toContain(
          i18n('ui.password.validation.at-most-<count>-characters', {
            count: maxLength,
          })
        );

        expect(element).not.toContainElement('.validation-message .active');
      });

      describe('and the password is shorter than the maxLength', () => {
        beforeEach(() => {
          getControl(element).value = '1234567';
          getControl(element).dispatchEvent(
            new Event('input', {
              bubbles: true,
            })
          );
        });

        it('should render active validation messages', () => {
          expect(
            element.renderRoot.querySelector('.validation-message.active')
              ?.textContent
          ).toContain(
            i18n('ui.password.validation.at-most-<count>-characters', {
              count: maxLength,
            })
          );
        });
      });

      describe('and the password is longer than the maxLength', () => {
        beforeEach(() => {
          getControl(element).value = '123456789';
          getControl(element).dispatchEvent(
            new InputEvent('input', {
              bubbles: true,
            })
          );
        });

        it('should render inactive validation messages', () => {
          expect(
            element.renderRoot.querySelector('.validation-message')?.textContent
          ).toContain(
            i18n('ui.password.validation.at-most-<count>-characters', {
              count: maxLength,
            })
          );

          expect(element).not.toContainElement('.validation-message .active');
        });
      });
    });

    describe('when the requireUpperLetter is set', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-password-input requireUpperLetter>
            <input type="password" aria-label="password" />
          </oryx-password-input>`
        );
      });

      it('should render inactive validation messages', () => {
        expect(
          element.renderRoot.querySelector('.validation-message')?.textContent
        ).toContain(i18n('ui.password.validation.upper-and-lowercase-letters'));

        expect(element).not.toContainElement('.validation-message .active');
      });

      describe('and the password does not contain an uppercase letter', () => {
        beforeEach(() => {
          getControl(element).value = 'abc';
          getControl(element).dispatchEvent(
            new Event('input', {
              bubbles: true,
            })
          );
        });

        it('should render inactive validation messages', () => {
          expect(
            element.renderRoot.querySelector('.validation-message')?.textContent
          ).toContain(
            i18n('ui.password.validation.upper-and-lowercase-letters')
          );

          expect(element).not.toContainElement('.validation-message .active');
        });
      });

      describe('and the password contains an uppercase letter', () => {
        beforeEach(() => {
          getControl(element).value = 'Abc';
          getControl(element).dispatchEvent(
            new InputEvent('input', {
              bubbles: true,
            })
          );
        });

        it('should render active validation messages', () => {
          expect(
            element.renderRoot.querySelector('.validation-message.active')
              ?.textContent
          ).toContain(
            i18n('ui.password.validation.upper-and-lowercase-letters')
          );
        });
      });
    });

    describe('when the requireNumber is set', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-password-input requireNumber>
            <input type="password" aria-label="password" />
          </oryx-password-input>`
        );
      });

      it('should render inactive validation messages', () => {
        expect(
          element.renderRoot.querySelector('.validation-message')?.textContent
        ).toContain(i18n('ui.password.validation.a-number'));

        expect(element).not.toContainElement('.validation-message .active');
      });

      describe('and the password does not contain a number', () => {
        beforeEach(() => {
          getControl(element).value = 'abc';
          getControl(element).dispatchEvent(
            new Event('input', {
              bubbles: true,
            })
          );
        });

        it('should render inactive validation messages', () => {
          expect(
            element.renderRoot.querySelector('.validation-message')?.textContent
          ).toContain(i18n('ui.password.validation.a-number'));

          expect(element).not.toContainElement('.validation-message .active');
        });
      });

      describe('and the password contains a number', () => {
        beforeEach(() => {
          getControl(element).value = 'abc1';
          getControl(element).dispatchEvent(
            new InputEvent('input', {
              bubbles: true,
            })
          );
        });

        it('should render active validation messages', () => {
          expect(
            element.renderRoot.querySelector('.validation-message.active')
              ?.textContent
          ).toContain(i18n('ui.password.validation.a-number'));
        });
      });
    });

    describe('when the requireSpecialChar is set', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-password-input requireSpecialChar>
            <input type="password" aria-label="password" />
          </oryx-password-input>`
        );
      });

      it('should render inactive validation messages', () => {
        expect(
          element.renderRoot.querySelector('.validation-message')?.textContent
        ).toContain(i18n('ui.password.validation.a-symbol'));

        expect(element).not.toContainElement('.validation-message .active');
      });

      describe('and the password does not contain a special character', () => {
        beforeEach(() => {
          getControl(element).value = 'abc1';
          getControl(element).dispatchEvent(
            new Event('input', {
              bubbles: true,
            })
          );
        });

        it('should render inactive validation messages', () => {
          expect(
            element.renderRoot.querySelector('.validation-message')?.textContent
          ).toContain(i18n('ui.password.validation.a-symbol'));

          expect(element).not.toContainElement('.validation-message .active');
        });
      });

      describe('and the password contains a special character', () => {
        beforeEach(() => {
          getControl(element).value = 'abc1!';
          getControl(element).dispatchEvent(
            new InputEvent('input', {
              bubbles: true,
            })
          );
        });

        it('should render active validation messages', () => {
          expect(
            element.renderRoot.querySelector('.validation-message.active')
              ?.textContent
          ).toContain(i18n('ui.password.validation.a-symbol'));
        });
      });
    });
  });
});
