import { ApplicationConfig, ApplicationType, Feature, Preset } from '../models';

export class ApplicationCliService {
  protected readonly applicationConfigs: ApplicationConfig[] = {
    [ApplicationType.Storefront]: {
      appType: ApplicationType.Storefront,
      presets: [Preset.B2C, Preset.B2B],
      features: [Feature.Labs],
    },
    [ApplicationType.Fulfillment]: {
      appType: ApplicationType.Fulfillment,
      features: [Feature.Labs],
    },
  };

  getApplicationConfig(appType: ApplicationType): ApplicationConfig {
    return this.applicationConfigs[appType];
  }

  getFeatures(appType: ApplicationType): Feature[] {
    return this.getApplicationConfig(appType).features ?? [];
  }

  getPresets(appType: ApplicationType): Preset[] {
    return this.getApplicationConfig(appType)?.presets ?? [];
  }

  getApplicationTypes(): ApplicationType[] {
    return Object.values(ApplicationType);
  }
}
