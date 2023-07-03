export type AddressSchema = string | string[];

export interface AddressOptions {
  multiline?: boolean;
  schema?: AddressSchema;
}

export const defaultSinglelineSchema = `{{salutation}}{{#salutation}}. {{/salutation}}
{{firstName}} {{lastName}}
{{#firstName|lastName}}, {{/firstName|lastName}}
{{company}}
{{#company}}, {{/company}}
{{address1}} {{address2}} {{address3}}
{{#address1|address2|address3}}, {{/address1|address2|address3}}
{{zipCode}} {{city}}
{{#zipCode|city}}, {{/zipCode|city}}
{{country}}
`;

export const defaultMultilineSchema = [
  '{{salutation}} {{firstName}} {{lastName}}',
  '{{company}}',
  '{{address1}}',
  '{{address2}}',
  '{{address3}}',
  '{{city}}',
  '{{zipCode}}',
  '{{country}}',
  '{{email}}',
  '{{phone}}',
];

export const defaultSimpleSchema = [
  '{{salutation}} {{firstName}} {{lastName}}',
  '{{address1}}',
  '{{city}}, {{zipCode}}',
  '{{country}}',
];

export const templateRe =
  /{{(#|\^)(.+?)}}(.+?){{\/(.+?)}}|{{(?!#|\^|\/)(.+?)}}/gm;
export const lineBreaksRe = /(\r\n|\n|\r)/gm;

export interface Match {
  keys: string[];
  template?: string;
  exclude: boolean;
  index: number;
  endIndex: number;
}
