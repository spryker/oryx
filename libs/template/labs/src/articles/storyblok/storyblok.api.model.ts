export module StoryblokCmsModel {
  export interface StoryContent {
    [key: string]: unknown;
    component: string;
    _uid: string;
  }

  export type Story<T = unknown> = T & {
    id: number;
    name: string;
    slug: string;
    full_slug: string;
    uuid: string;
    content_type: string;
  };

  export interface Language {
    code: string;
    name: string;
  }

  export interface Space {
    name: string;
    id: number;
    languages: Language[];
  }

  export interface Field {
    type: string;
    translatable?: boolean;
  }

  export interface Component {
    name: string;
    display_name: string;
    id: number;
    schema: Record<string, Field>;
  }

  export interface EntryResponse {
    story: Story<{ content: StoryContent }>;
  }

  export interface EntriesResponse {
    stories: Story[];
  }

  export interface SpaceResponse {
    space: Space;
  }

  export interface ComponentResponse {
    component: Component;
  }
}
