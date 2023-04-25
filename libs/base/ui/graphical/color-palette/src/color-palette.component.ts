import { ColorMode, ColorTone } from '@spryker-oryx/core';
import { colorPalette } from '@spryker-oryx/themes/design-tokens';
import { html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import { ColorPaletteAttributes } from './color-palette.model';
import { colorPaletteStyles } from './color-palette.styles';

export class ColorPaletteComponent
  extends LitElement
  implements ColorPaletteAttributes
{
  static styles = [colorPaletteStyles];

  protected palette = colorPalette;

  @property() mode?: ColorMode;
  @property() tone?: ColorTone;
  @property() color?: string;
  @property() layout?: 'list' | 'grid';

  @state() selected?: string;
  // @state() list?: boolean;

  protected handleInput(ev: Event): void {
    this.selected = (ev.target as HTMLInputElement).value;
  }

  // protected onToggle(ev: Event): void {
  //   this.list = true;
  // }

  protected override render(): TemplateResult {
    return html`
      <oryx-toggle>
        <input
          name="test-group"
          value="one"
          aria-label="male a11y happy"
          type="checkbox"
        />
        List
      </oryx-toggle>

      <!--         
      <oryx-swatch
        class="selected"
        color=${ifDefined(this.selected)}
      ></oryx-swatch>

      <div>
        <oryx-toggle>
          <input
            name="test-group"
            value="one"
            aria-label="male a11y happy"
            type="checkbox"
          />
          First toggle
        </oryx-toggle>
      </div>
       <input type="color" /> -->

      <oryx-checkbox><input type="checkbox" />Grays</oryx-checkbox>

      <section @input=${this.handleInput} layout=${ifDefined(this.layout)}>
        ${repeat(
          this.getColors(),
          (color) => html`
            ${repeat(
              this.getColorModes(color),
              (mode) => html`
                ${repeat(
                  this.getTones(color, mode),
                  (tone) =>
                    html` <label>
                      <oryx-swatch
                        title="${color} ${tone}"
                        color=${tone}
                      ></oryx-swatch>
                      <input type="radio" name="colors" value=${tone} />
                    </label>`
                )}
              `
            )}
          `
        )}
      </section>
    `;
  }

  protected getColors(): string[] {
    if (this.color) {
      return [this.color];
    }
    return Object.keys(this.palette);
  }

  protected getColorModes(color: string): ColorMode[] {
    if (this.mode) {
      return [this.mode];
    }
    return Object.keys(this.palette[color]) as ColorMode[];
  }

  protected getTones(color: string, colorMode: ColorMode): string[] {
    const tones = Object.values(
      this.palette[color][colorMode] as {
        [tone in ColorTone]?: string;
      }
    );
    if (this.tone !== undefined) {
      return [tones[this.tone]];
    }
    return tones;
  }
}
