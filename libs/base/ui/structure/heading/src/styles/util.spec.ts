import { HeadingTag } from '../heading.model';
import { headingUtil } from './util';

describe('headingUtil', () => {
  [HeadingTag.H1, HeadingTag.H2, HeadingTag.Small].forEach((tag) => {
    describe('when tag is ' + tag, () => {
      const style = headingUtil(tag);

      it('should contain font-size', () => {
        expect(style.cssText).toContain(
          `font-size: var(--oryx-typography-${tag}-size)`
        );
      });

      it('should contain font-weight', () => {
        expect(style.cssText).toContain(
          `font-weight: var(--oryx-typography-${tag}-weight)`
        );
      });

      it('should contain line-height', () => {
        expect(style.cssText).toContain(
          `line-height: var(--oryx-typography-${tag}-line)`
        );
      });

      it('should end with semi-column', () => {
        expect(style.cssText.trim().endsWith(';')).to.eq(true);
      });
    });

    describe('when margin is not provided', () => {
      const style = headingUtil(tag);

      it('should have zero margin by default', () => {
        expect(style.cssText).toContain(`margin: 0`);
      });
    });

    describe('when margin is provided', () => {
      const style = headingUtil(tag, { margin: '0 0 10px' });

      it('should have the give margin', () => {
        expect(style.cssText).toContain(`margin: 0 0 10px`);
      });
    });

    describe('when margin is undefined', () => {
      const style = headingUtil(tag, {});

      it('should not have a margin', () => {
        expect(style.cssText).not.toContain(`margin:`);
      });
    });
  });
});
