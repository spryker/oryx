import { fixture, html } from '@open-wc/testing-helpers';
import '@spryker-oryx/testing';
import { a11yConfig } from '../../../a11y';
import { ChipComponent } from './chip.component';
import { ChipType } from './chip.model';
import './index';

describe('ChipComponent', () => {
  let element: ChipComponent;

  it('is defined', () => {
    const el = document.createElement('oryx-chip');
    expect(el).toBeInstanceOf(ChipComponent);
  });

  describe('chip type', () => {
    const types: ChipType[] = [
      ChipType.DEFAULT,
      ChipType.ONLINE,
      ChipType.ACTIVE,
      ChipType.OFFLINE,
      ChipType.INACTIVE,
      ChipType.LOW,
      ChipType.INFO,
      ChipType.WARNING,
      ChipType.ERROR,
      ChipType.SUCCESS,
    ];
    Object.values(types).forEach((type) => {
      describe(`when type is "${type}"`, () => {
        beforeEach(async () => {
          element = await fixture(
            html` <oryx-chip type="${type}"></oryx-chip>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should reflect the type attribute on the node', () => {
          expect(element?.getAttribute('type')).toBe(type);
        });
      });
    });
  });
});
