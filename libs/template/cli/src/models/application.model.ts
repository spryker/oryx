export interface ApplicationConfig {
  type: ApplicationType;
  presets?: Preset[];
  features?: Feature[];
}

export enum ApplicationType {
  Storefront = 'storefront',
  Fulfillment = 'fulfillment',
}

export enum Preset {
  B2C = 'b2c',
  B2B = 'b2b',
}

export enum Feature {
  Labs = 'labs',
}
