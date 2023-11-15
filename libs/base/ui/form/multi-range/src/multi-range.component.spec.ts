import { fixture, html } from '@open-wc/testing-helpers';
import { a11yConfig, useComponent } from '@spryker-oryx/utilities';
import { MultiRangeComponent } from './multi-range.component';
import { multiRangeComponent } from './multi-range.def';

describe('MultiRangeComponent', () => {
  let element: MultiRangeComponent;
  const callback = vi.fn();

  const getInput = (isMax = false): HTMLInputElement =>
    element.renderRoot.querySelectorAll<HTMLInputElement>('input')[+isMax];

  beforeAll(async () => {
    await useComponent(multiRangeComponent);
  });

  beforeEach(async () => {
    element = await fixture(
      html`<oryx-multi-range @change=${callback}></oryx-multi-range>`
    );
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(MultiRangeComponent);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible(a11yConfig);
  });

  it('should not disable the element', () => {
    expect(element.disabled).not.toBeDefined();
  });

  it('should apply default aria-labels', () => {
    expect(element).toContainElement('label[aria-label="min"]:nth-of-type(1)');
    expect(element).toContainElement('label[aria-label="max"]:nth-of-type(2)');
  });

  it('should apply default set of properties to the inputs', () => {
    expect(getInput().value).toBe('0');
    expect(getInput().min).toBe('0');
    expect(getInput().max).toBe('100');
    expect(getInput().step).toBe('1');
    expect(getInput().disabled).toBe(false);

    expect(getInput(true).value).toBe('100');
    expect(getInput(true).min).toBe('0');
    expect(getInput(true).max).toBe('100');
    expect(getInput(true).step).toBe('1');
    expect(getInput(true).disabled).toBe(false);
  });

  it('should render active bar', () => {
    expect(element).toContainElement('div.active');
  });

  it('should set range css properties', () => {
    expect(element.style.getPropertyValue('--_multi-range-min')).toBe('0%');
    expect(element.style.getPropertyValue('--_multi-range-max')).toBe('0%');
  });

  it('should dispatch change event with actual min and max values', () => {
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          minValue: element.minValue,
          maxValue: element.maxValue,
        }),
      })
    );
  });

  describe('when component is disabled', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-multi-range disabled></oryx-multi-range>`
      );
    });

    it('should disable max range input', () => {
      expect(getInput(true).disabled).toBe(true);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });
  });

  describe('when step property is set to 3', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-multi-range step="3"></oryx-multi-range>`
      );
    });

    it('should pass step to the inputs', () => {
      expect(getInput().step).toBe('3');
      expect(getInput(true).step).toBe('3');
    });
  });

  describe('when min property is set 2 and max set to 99', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-multi-range min="2" max="99"></oryx-multi-range>`
      );
    });

    it('should pass min and max values to the inputs', () => {
      expect(getInput().min).toBe('2');
      expect(getInput().max).toBe('99');

      expect(getInput(true).min).toBe('2');
      expect(getInput(true).max).toBe('99');
    });
  });

  describe('when minValue property is set to 5', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-multi-range minValue="5"></oryx-multi-range>`
      );
    });

    it('should pass minValue to the value of min input', () => {
      expect(getInput().value).toBe('5');
    });
  });

  describe('when minValue property is set to the value bigger then maxValue', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-multi-range maxValue="10"></oryx-multi-range>`
      );
    });

    it('should re-calculate minValue relatively the maxValue', async () => {
      element.minValue = 11;

      await expect(element.minValue).toBe(9);
    });
  });

  describe('when minValue property is set to the value less then min', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-multi-range min="0" minValue="-1"></oryx-multi-range>`
      );
    });

    it('should assign min as a value for minValue', async () => {
      await expect(element.minValue).toBe(0);
    });
  });

  describe('when maxValue property is set to the value less then minValue', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-multi-range minValue="1"></oryx-multi-range>`
      );
    });

    it('should re-calculate maxValue relatively the minValue', async () => {
      element.maxValue = 0;

      await expect(element.maxValue).toBe(2);
    });
  });

  describe('when maxValue property is set to the value bigger then max', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-multi-range max="10" maxValue="11"></oryx-multi-range>`
      );
    });

    it('should assign max as a value of maxValue', async () => {
      await expect(element.maxValue).toBe(10);
    });
  });

  describe('when maxValue property is set to the value bigger then max', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-multi-range max="10" maxValue="11"></oryx-multi-range>`
      );
    });

    it('should assign max as a value of maxValue', async () => {
      await expect(element.maxValue).toBe(10);
    });
  });

  describe('when inputs change the values', () => {
    describe('when min input changes its value', () => {
      const newValue = '20';
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-multi-range
            minValue="10"
            maxValue="90"
          ></oryx-multi-range>`
        );

        getInput().value = newValue;
        getInput().dispatchEvent(new Event('input'));
      });

      it('should apply new value', () => {
        expect(element.minValue).toBe(+newValue);
      });

      describe('and value is exceed maxValue - step', () => {
        beforeEach(async () => {
          getInput().value = '90';
          getInput().dispatchEvent(new Event('input'));
        });

        it('should recalculate minValue relatively maxValue', () => {
          expect(element.minValue).toBe(element.maxValue - element.step);
        });
      });
    });

    describe('when min input changes its value', () => {
      const newValue = '50';
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-multi-range
            minValue="10"
            maxValue="90"
          ></oryx-multi-range>`
        );

        getInput(true).value = newValue;
        getInput(true).dispatchEvent(new Event('input'));
      });

      it('should apply new value', () => {
        expect(element.maxValue).toBe(+newValue);
      });

      describe('and value is less than minValue + step', () => {
        beforeEach(async () => {
          getInput(true).value = '0';
          getInput(true).dispatchEvent(new Event('input'));
        });

        it('should recalculate maxValue relatively minValue', () => {
          expect(element.maxValue).toBe(element.minValue + element.step);
        });
      });
    });
  });

  describe('featureVersion >= 1.2', () => {
    beforeEach(async () => {
      mockFeatureVersion('1.2');
    });

    [
      {
        title: 'when step is greater than max - min',
        step: 101,
      },
      {
        title: 'when min >= max',
        min: 200,
      },
      {
        title: 'when max <= min',
        max: -1,
      },
    ].forEach(({ title, step = 2, min = 20, max = 70 }) => {
      describe(title, () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-multi-range
              step=${step}
              min=${min}
              max=${max}
            ></oryx-multi-range>`
          );
        });

        it('should not render the bar', () => {
          expect(element).not.toContainElement('div.active');
        });

        it('should apply default values to the inputs and disable them', () => {
          expect(getInput().value).toBe('0');
          expect(getInput().min).toBe('0');
          expect(getInput().max).toBe('100');
          expect(getInput().step).toBe('1');
          expect(getInput().disabled).toBe(true);

          expect(getInput(true).value).toBe('100');
          expect(getInput(true).min).toBe('0');
          expect(getInput(true).max).toBe('100');
          expect(getInput(true).step).toBe('1');
          expect(getInput(true).disabled).toBe(true);
        });
      });
    });

    describe('when minValue is out of the range', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-multi-range minValue="200"></oryx-multi-range>`
        );
      });

      it('should apply min as a value for minValue', () => {
        expect(element.minValue).toBe(element.min);
      });
    });

    describe('when maxValue is out of the range', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-multi-range maxValue="-1"></oryx-multi-range>`
        );
      });

      it('should apply max as a value for maxValue', () => {
        expect(element.maxValue).toBe(element.max);
      });
    });

    describe('when minValue is larger than maxValue', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-multi-range
            minValue="50"
            maxValue="20"
          ></oryx-multi-range>`
        );
      });

      it('should apply range boundaries as values for minValue and maxValue', () => {
        expect(element.minValue).toBe(element.min);
        expect(element.maxValue).toBe(element.max);
      });
    });

    describe('when inputs change the values', () => {
      describe('when min input changes its value', () => {
        const callbackInput = vi.fn();
        const callbackChange = vi.fn();
        const newValue = '10';
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-multi-range
              @drag=${callbackInput}
              @change=${callbackChange}
            ></oryx-multi-range>`
          );

          getInput().value = newValue;
          getInput().dispatchEvent(new Event('input'));
        });

        it('should re-calculate min range css var', () => {
          expect(element.style.getPropertyValue('--_multi-range-min')).toBe(
            '10%'
          );
        });

        it('should not apply the value', () => {
          expect(element.minValue).toBe(0);
        });

        it('should dispatch drag event with actual min and max values', () => {
          expect(callbackInput).toHaveBeenCalledWith(
            expect.objectContaining({
              detail: expect.objectContaining({
                minValue: +newValue,
                maxValue: element.maxValue,
              }),
            })
          );
        });

        describe('and input emits change event', () => {
          beforeEach(async () => {
            getInput().dispatchEvent(new Event('change'));
          });

          it('should apply the value', () => {
            expect(element.minValue).toBe(10);
          });

          it('should dispatch change event with actual min and max values', () => {
            expect(callbackChange).toHaveBeenCalledWith(
              expect.objectContaining({
                detail: expect.objectContaining({
                  minValue: +newValue,
                  maxValue: element.maxValue,
                }),
              })
            );
          });
        });

        describe('and value is bigger then max - step', () => {
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-multi-range></oryx-multi-range>`
            );

            getInput().value = '100';
            getInput().dispatchEvent(new Event('input'));
          });

          it('should re-calculate input`s value relatively maxValue', () => {
            expect(getInput().value).toBe('99');
          });
        });
      });

      describe('when max input changes its value', () => {
        const callback = vi.fn();
        const newValue = '75';
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-multi-range @change=${callback}></oryx-multi-range>`
          );

          getInput(true).value = newValue;
          getInput(true).dispatchEvent(new Event('input'));
        });

        it('should re-calculate max range css var', () => {
          expect(element.style.getPropertyValue('--_multi-range-max')).toBe(
            '25%'
          );
        });

        it('should not apply the value', () => {
          expect(element.maxValue).toBe(100);
        });

        describe('and input emits change event', () => {
          beforeEach(async () => {
            getInput(true).dispatchEvent(new Event('change'));
          });

          it('should apply the value', () => {
            expect(element.maxValue).toBe(75);
          });

          it('should dispatch change event with actual min and max values', () => {
            expect(callback).toHaveBeenCalledWith(
              expect.objectContaining({
                detail: expect.objectContaining({
                  minValue: element.minValue,
                  maxValue: +newValue,
                }),
              })
            );
          });
        });

        describe('and value is less then min + step', () => {
          beforeEach(async () => {
            getInput(true).value = '0';
            getInput(true).dispatchEvent(new Event('input'));
          });

          it('should re-calculate input`s value relatively minValue', () => {
            expect(getInput(true).value).toBe('1');
          });
        });
      });
    });
  });
});
