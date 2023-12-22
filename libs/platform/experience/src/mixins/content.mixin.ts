import { FeatureOptionsService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import {
  computed,
  getStaticProp,
  I18nMixin,
  I18nMixinType,
  InstanceWithStatic,
  signal,
  Signal,
  signalAware,
  signalProperty,
  Type,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { ContentController } from '../controllers';
import { optionsKey } from '../decorators';
import { ContentComponentProperties } from '../models';
import { ExperienceService } from '../services';

export declare class ContentMixinInterface<OptionsType, ContentType>
  implements ContentComponentProperties<OptionsType, ContentType>
{
  uid?: string;
  options?: OptionsType;
  content?: ContentType;
  protected contentController: ContentController<ContentType, OptionsType>;
  protected $options: Signal<OptionsType>;
  protected $content: Signal<ContentType>;
}

export const ContentMixinInternals = Symbol('ContentMixinInternals');

export const ContentMixin = <
  OptionsType,
  ContentType = unknown,
  T extends Type<LitElement> = Type<LitElement>
>(
  superClass: T
): Type<ContentMixinInterface<OptionsType, ContentType> & I18nMixinType> &
  T => {
  @signalAware()
  class ContentMixinClass extends I18nMixin(superClass) {
    @signalProperty() uid?: string;

    @signalProperty({ type: Object, reflect: true })
    options?: Partial<OptionsType>;

    @property({ type: Object, reflect: true })
    content?: ContentType;

    protected contentController = new ContentController(this);

    protected [ContentMixinInternals] = {
      experienceService: resolve(ExperienceService, null),
      optionsService: resolve(FeatureOptionsService, null),
    };

    protected $compositionOptions = computed(() =>
      this[ContentMixinInternals].experienceService?.getOptions({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        uid: this.uid!,
      })
    );
    protected $options = computed(() => {
      const defaultOptions = {
        ...getStaticProp(
          this as unknown as InstanceWithStatic<OptionsType>,
          optionsKey
        ),
        ...this[ContentMixinInternals].optionsService?.getFeatureOptions?.(
          this.tagName
        ),
      } as OptionsType;

      if (this.options !== undefined) {
        return {
          ...defaultOptions,
          ...this.options,
        };
      }

      return {
        ...defaultOptions,
        ...(this.uid ? this.$compositionOptions() : {}),
      };
    });

    protected $content = signal(this.contentController.getContent(), {
      initialValue: {},
    });
  }
  return ContentMixinClass as unknown as Type<
    ContentMixinInterface<OptionsType, ContentType> & I18nMixinType
  > &
    T;
};
