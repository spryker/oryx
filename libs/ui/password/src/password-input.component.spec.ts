import { expect, fixture, html } from '@open-wc/testing';
import { TemplateResult } from 'lit';
import * as sinon from 'sinon';
import { a11yConfig } from '../../a11y';
import { getControl } from '../../input';
import './index';
import { PasswordInputComponent } from './password-input.component';
import { PasswordVisibilityStrategy } from './password-input.model';

describe('PasswordComponent', () => {
  let element: PasswordInputComponent;

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
      expect(getControl(element).getAttribute('type')).to.eq('password');
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
        expect(element.querySelector('input')?.getAttribute('type')).to.eq(
          'text'
        );
      });
    };

    const expectNotAfterEvent = (event: string): void => {
      it('should not make the password visible', () => {
        toggle?.dispatchEvent(new MouseEvent(event, { bubbles: true }));
        expect(element.querySelector('input')?.getAttribute('type')).to.not.eq(
          'text'
        );
      });
    };

    describe('when the strategy is set to NONE', () => {
      beforeEach(async () => {
        element = await fixture(render(PasswordVisibilityStrategy.NONE));
        toggle = element.shadowRoot?.querySelector('oryx-icon');
      });

      it('should pass the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should not have a button to make the password visible', () => {
        expect(toggle).to.not.exist;
      });

      it('should have an input with password type', () => {
        expect(element.querySelector('input')?.getAttribute('type')).to.eq(
          'password'
        );
      });
    });

    describe('when the strategy is set to CLICK', () => {
      beforeEach(async () => {
        element = await fixture(render(PasswordVisibilityStrategy.CLICK));
        toggle = element.shadowRoot?.querySelector('oryx-icon');
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
          expect(
            element.querySelector('input')?.getAttribute('type')
          ).not.to.eq('text');
        });
      });
    });

    describe('when the strategy is set to MOUSEDOWN', () => {
      beforeEach(async () => {
        element = await fixture(render(PasswordVisibilityStrategy.MOUSEDOWN));
        toggle = element.shadowRoot?.querySelector('oryx-icon');
      });
      it('should have a button', () => {
        expect(toggle).to.exist;
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
        element = await fixture(render(PasswordVisibilityStrategy.HOVER));
        toggle = element.shadowRoot?.querySelector('oryx-icon');
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
      let clock: sinon.SinonFakeTimers;

      describe('and a timeout is set to 10ms', () => {
        beforeEach(async () => {
          clock = sinon.useFakeTimers();
          element = await fixture(
            html`<oryx-password-input
              .strategy=${PasswordVisibilityStrategy.CLICK}
              .timeout=${10}
            >
              <input type="password" aria-label="password" />
            </oryx-password-input>`
          );
          toggle = element.shadowRoot?.querySelector('oryx-icon');
          toggle?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        afterEach(() => {
          sinon.restore();
        });

        describe('when 9ms has passed', () => {
          beforeEach(() => {
            clock.tick(9);
          });

          it('should still show the password', () => {
            expect(element.querySelector('input')?.getAttribute('type')).to.eq(
              'text'
            );
          });
        });

        describe('when 10ms has passed', () => {
          beforeEach(() => {
            clock.tick(10);
          });

          it('should no longer show the password', () => {
            expect(element.querySelector('input')?.getAttribute('type')).to.eq(
              'password'
            );
          });
        });
      });
    });
  });
});
