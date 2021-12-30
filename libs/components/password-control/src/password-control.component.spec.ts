import { expect, fixture, html } from '@open-wc/testing';
import { TemplateResult } from 'lit';
import './index';
import { PasswordVisibilityStrategy } from './model';
import { PasswordControlComponent } from './password-control.component';

describe('PasswordControlComponent', () => {
  let element: PasswordControlComponent;

  describe('when the <oryx-password-control> is created', () => {
    it('is should be an instance of PasswordControlComponent', () => {
      const el = document.createElement('oryx-password-control');
      expect(el).to.be.instanceof(PasswordControlComponent);
    });
  });

  describe('when the password control is rendered', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-password-control><input type="password"></input></oryx-password-control>`
      );
    });

    it('should have an input with password type', () => {
      expect(element.querySelector('input')?.getAttribute('type')).to.eq(
        'password'
      );
    });
  });

  describe('visibility strategies', () => {
    let toggle: HTMLButtonElement | undefined | null;

    const render = (
      strategy: PasswordVisibilityStrategy
    ): TemplateResult => html`<oryx-password-control .strategy=${strategy}>
        <input type="password"></input>
    </oryx-password-control>`;

    const expectAfterEvent = (event: string) => {
      it('should make the password visible', () => {
        toggle?.dispatchEvent(new MouseEvent(event, { bubbles: true }));
        expect(element.querySelector('input')?.getAttribute('type')).to.eq(
          'text'
        );
      });
    };

    const expectNotAfterEvent = (event: string) => {
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
        toggle = element.shadowRoot?.querySelector('button');
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
        toggle = element.shadowRoot?.querySelector('button');
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
        toggle = element.shadowRoot?.querySelector('button');
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
        toggle = element.shadowRoot?.querySelector('button');
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
      describe('and a timeout is set to 10', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-password-control .strategy=${
              PasswordVisibilityStrategy.CLICK
            } .timeout=${10}>
              <input type="password"></input>
            </oryx-password-control>`
          );
          toggle = element.shadowRoot?.querySelector('button');
        });

        it('should still show the password after 9ms', (done) => {
          toggle?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          expect(element.querySelector('input')?.getAttribute('type')).to.eq(
            'text'
          );
          setTimeout(() => {
            expect(element.querySelector('input')?.getAttribute('type')).to.eq(
              'text'
            );
            done();
          }, 9);
        });

        it('but should hide the password at 10ms', (done) => {
          toggle?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          expect(element.querySelector('input')?.getAttribute('type')).to.eq(
            'text'
          );
          setTimeout(() => {
            expect(
              element.querySelector('input')?.getAttribute('type')
            ).to.not.eq('text');
            done();
          }, 10);
        });
      });
    });
  });
});
