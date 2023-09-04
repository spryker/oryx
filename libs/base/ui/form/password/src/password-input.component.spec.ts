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
    const messageSelector = '.validation-message';
    const activeMessageSelector = '.validation-message.active';

    describe('when minLength is set', () => {
      const minLength = 5;
      const message = i18n('ui.password.at-least-<count>-characters', {
        count: minLength,
      });

      beforeEach(async () => {
        element = await fixture(
          html`<oryx-password-input .minLength=${minLength}>
            <input type="password" aria-label="password" />
          </oryx-password-input>`
        );
      });

      it('should render inactive validation messages initially', () => {
        expect(
          element.renderRoot.querySelector(messageSelector)?.textContent
        ).toContain(message);
        expect(element).not.toContainElement(activeMessageSelector);
      });

      describe('and the password contains less than minLength characters', () => {
        beforeEach(() => {
          getControl(element).value = 'pass';
          getControl(element).dispatchEvent(
            new InputEvent('input', { bubbles: true })
          );
        });

        it('should render inactive validation messages', () => {
          expect(
            element.renderRoot.querySelector(messageSelector)?.textContent
          ).toContain(message);
          expect(element).not.toContainElement(activeMessageSelector);
        });
      });

      describe('and the password contains exactly minLength characters', () => {
        beforeEach(() => {
          getControl(element).value = 'passe';
          getControl(element).dispatchEvent(
            new InputEvent('input', { bubbles: true })
          );
        });

        it('should render active validation messages', () => {
          expect(
            element.renderRoot.querySelector(activeMessageSelector)?.textContent
          ).toContain(message);
        });
      });

      describe('and the password contains more than minLength characters', () => {
        beforeEach(() => {
          getControl(element).value = 'password';
          getControl(element).dispatchEvent(
            new InputEvent('input', { bubbles: true })
          );
        });

        it('should render active validation messages', () => {
          expect(
            element.renderRoot.querySelector(activeMessageSelector)?.textContent
          ).toContain(message);
        });
      });
    });

    describe('when maxLength is set', () => {
      const maxLength = 8;
      const message = i18n('ui.password.at-most-<count>-characters', {
        count: maxLength,
      });

      beforeEach(async () => {
        element = await fixture(
          html`<oryx-password-input .maxLength=${maxLength}>
            <input type="password" aria-label="password" />
          </oryx-password-input>`
        );
      });

      it('should render active validation messages', () => {
        expect(
          element.renderRoot.querySelector(activeMessageSelector)?.textContent
        ).toContain(message);
      });

      describe('and the password contains more than maxLength characters', () => {
        beforeEach(() => {
          getControl(element).value = 'longpassw';
          getControl(element).dispatchEvent(
            new InputEvent('input', { bubbles: true })
          );
        });

        it('should render inactive validation messages', () => {
          expect(
            element.renderRoot.querySelector(messageSelector)?.textContent
          ).toContain(message);
          expect(element).not.toContainElement(activeMessageSelector);
        });
      });

      describe('and the password contains exactly maxLength characters', () => {
        beforeEach(() => {
          getControl(element).value = 'longpass';
          getControl(element).dispatchEvent(
            new InputEvent('input', { bubbles: true })
          );
        });

        it('should render active validation messages', () => {
          expect(
            element.renderRoot.querySelector(activeMessageSelector)?.textContent
          ).toContain(message);
        });
      });

      describe('and the password contains less than maxLength characters', () => {
        beforeEach(() => {
          getControl(element).value = 'short';
          getControl(element).dispatchEvent(
            new InputEvent('input', { bubbles: true })
          );
        });

        it('should render active validation messages', () => {
          expect(
            element.renderRoot.querySelector(activeMessageSelector)?.textContent
          ).toContain(message);
        });
      });
    });

    describe('when minUppercaseChars is set', () => {
      const minUppercaseChars = 2;
      const message = i18n('ui.password.at-least-<count>-uppercase-letters', {
        count: minUppercaseChars,
      });

      beforeEach(async () => {
        element = await fixture(
          html`<oryx-password-input .minUppercaseChars=${minUppercaseChars}>
            <input type="password" aria-label="password" />
          </oryx-password-input>`
        );
      });

      it('should render inactive validation messages initially', () => {
        expect(
          element.renderRoot.querySelector(messageSelector)?.textContent
        ).toContain(message);
        expect(element).not.toContainElement(activeMessageSelector);
      });

      describe('and the password contains less than the required uppercase letters', () => {
        beforeEach(() => {
          getControl(element).value = 'Pass';
          getControl(element).dispatchEvent(
            new InputEvent('input', { bubbles: true })
          );
        });

        it('should render inactive validation messages', () => {
          expect(
            element.renderRoot.querySelector(messageSelector)?.textContent
          ).toContain(message);
          expect(element).not.toContainElement(activeMessageSelector);
        });
      });

      describe('and the password contains the exact required number of uppercase letters', () => {
        beforeEach(() => {
          getControl(element).value = 'PAss';
          getControl(element).dispatchEvent(
            new InputEvent('input', { bubbles: true })
          );
        });

        it('should render active validation messages', () => {
          expect(
            element.renderRoot.querySelector(activeMessageSelector)?.textContent
          ).toContain(message);
        });
      });

      describe('and the password contains more than the required number of uppercase letters', () => {
        beforeEach(() => {
          getControl(element).value = 'PASs';
          getControl(element).dispatchEvent(
            new InputEvent('input', { bubbles: true })
          );
        });

        it('should render active validation messages', () => {
          expect(
            element.renderRoot.querySelector(activeMessageSelector)?.textContent
          ).toContain(message);
        });
      });
    });

    describe('when minNumbers is set', () => {
      const minNumbers = 2;
      const message = i18n('ui.password.at-least-<count>-numbers', {
        count: minNumbers,
      });

      beforeEach(async () => {
        element = await fixture(
          html`<oryx-password-input .minNumbers=${minNumbers}>
            <input type="password" aria-label="password" />
          </oryx-password-input>`
        );
      });

      it('should render inactive validation messages initially', () => {
        expect(
          element.renderRoot.querySelector(messageSelector)?.textContent
        ).toContain(message);
        expect(element).not.toContainElement(activeMessageSelector);
      });

      describe('and the password contains less than the required numbers', () => {
        beforeEach(() => {
          getControl(element).value = 'Pass1';
          getControl(element).dispatchEvent(
            new InputEvent('input', { bubbles: true })
          );
        });

        it('should render inactive validation messages', () => {
          expect(
            element.renderRoot.querySelector(messageSelector)?.textContent
          ).toContain(message);
          expect(element).not.toContainElement(activeMessageSelector);
        });
      });

      describe('and the password contains the exact required number of numbers', () => {
        beforeEach(() => {
          getControl(element).value = 'Pass12';
          getControl(element).dispatchEvent(
            new InputEvent('input', { bubbles: true })
          );
        });

        it('should render active validation messages', () => {
          expect(
            element.renderRoot.querySelector(activeMessageSelector)?.textContent
          ).toContain(message);
        });
      });

      describe('and the password contains more than the required number of numbers', () => {
        beforeEach(() => {
          getControl(element).value = 'Pass123';
          getControl(element).dispatchEvent(
            new InputEvent('input', { bubbles: true })
          );
        });

        it('should render active validation messages', () => {
          expect(
            element.renderRoot.querySelector(activeMessageSelector)?.textContent
          ).toContain(message);
        });
      });
    });

    describe('when minSpecialChars is set', () => {
      const minSpecialChars = 2; // Adjust as necessary
      const message = i18n('ui.password.at-least-<count>-special-chars', {
        count: minSpecialChars,
      });

      beforeEach(async () => {
        element = await fixture(
          html`<oryx-password-input .minSpecialChars=${minSpecialChars}>
            <input type="password" aria-label="password" />
          </oryx-password-input>`
        );
      });

      it('should render inactive validation messages initially', () => {
        expect(
          element.renderRoot.querySelector(messageSelector)?.textContent
        ).toContain(message);
        expect(element).not.toContainElement(activeMessageSelector);
      });

      describe('and the password contains less than the required special characters', () => {
        beforeEach(() => {
          getControl(element).value = 'p@ssword';
          getControl(element).dispatchEvent(
            new InputEvent('input', { bubbles: true })
          );
        });

        it('should render inactive validation messages', () => {
          expect(
            element.renderRoot.querySelector(messageSelector)?.textContent
          ).toContain(message);
          expect(element).not.toContainElement(activeMessageSelector);
        });
      });

      describe('and the password contains the exact number of required special characters', () => {
        beforeEach(() => {
          getControl(element).value = 'p@s$word';
          getControl(element).dispatchEvent(
            new InputEvent('input', { bubbles: true })
          );
        });

        it('should render active validation messages', () => {
          expect(
            element.renderRoot.querySelector(activeMessageSelector)?.textContent
          ).toContain(message);
        });
      });

      describe('and the password contains more than the required special characters', () => {
        beforeEach(() => {
          getControl(element).value = 'p@s$w#rd';
          getControl(element).dispatchEvent(
            new InputEvent('input', { bubbles: true })
          );
        });

        it('should render active validation messages', () => {
          expect(
            element.renderRoot.querySelector(activeMessageSelector)?.textContent
          ).toContain(message);
        });
      });
    });
  });
});
