import { ContentMixin } from '@spryker-oryx/experience';
import { Address, AddressMixin } from '@spryker-oryx/user';
import { hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import {
  AddressOptions,
  AddressSchema,
  defaultMultilineSchema,
  defaultSinglelineSchema,
  lineBreaksRe,
  Match,
  templateRe,
} from './address.model';
import { styles } from './address.styles';

@hydratable('mouseover')
export class AddressComponent extends AddressMixin(
  ContentMixin<AddressOptions>(LitElement)
) {
  static styles = styles;

  protected override render():
    | string
    | TemplateResult
    | TemplateResult[]
    | void {
    const address = this.$address();
    if (!address) return;

    const { multiline, schema } = this.$options();

    if (multiline)
      return this.renderMultiline(schema ?? defaultMultilineSchema, address);

    return this.formatLine(schema ?? defaultSinglelineSchema, address);
  }

  protected renderMultiline(
    schema: AddressSchema,
    address: Address
  ): TemplateResult[] {
    return (Array.isArray(schema) ? schema : [schema]).map((str) => {
      const formattedLine = this.formatLine(str, address);
      return formattedLine.trim() ? html`<p>${formattedLine}</p>` : html``;
    });
  }

  protected formatLine(schema: AddressSchema, address: Address): string {
    const str = Array.isArray(schema) ? schema.join(' ') : schema;
    const matches = this.findMatches(str);

    if (!matches.length) {
      return str;
    }

    return [
      ...(matches[0].index ? [str.substring(0, matches[0].index)] : []),
      ...matches.map(
        (cfg, i) =>
          `${this.ensureContent(cfg, address)}${str.substring(
            cfg.endIndex,
            matches[i + 1]?.index ?? str.length
          )}`
      ),
    ]
      .join('')
      .replace(lineBreaksRe, '');
  }

  protected findMatches(str: string): Match[] {
    const config: Match[] = [];
    let result;
    while ((result = templateRe.exec(str)) !== null) {
      const cfg = this.parseMatch(result);

      if (cfg) {
        config.push(cfg);
      }
    }

    return config;
  }

  protected parseMatch(result: RegExpExecArray): Match | null {
    const [match, qualifier, conditionStart, template, conditionEnd, key] =
      result;
    const { index } = result;

    if (!key && conditionStart !== conditionEnd) {
      return null;
    }

    return {
      keys: (key ?? conditionStart).split('|'),
      index,
      endIndex: index + match.length,
      template,
      exclude: qualifier === '^',
    };
  }

  protected ensureContent(match: Match, address: Address): string {
    const { keys, template, exclude } = match;

    const value = Object.entries(address).find(
      ([key, value]) => keys.includes(key) && value
    )?.[1];

    if (!!value === exclude) {
      return '';
    }

    return template ?? value ?? '';
  }
}
