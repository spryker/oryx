import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { VideoAspectRatio, VideoPreload } from '@spryker-oryx/ui/video';
import { ContentVideoComponent } from './video.component';

export const videoComponentSchema: ContentComponentSchema<ContentVideoComponent> =
  {
    name: 'Video',
    group: 'Content',
    icon: '<path d="M6 16H18L14.5 8L11.5 14.5L9 10.5L6 16ZM3.33333 20C2.97778 20 2.66667 19.8667 2.4 19.6C2.13333 19.3333 2 19.0222 2 18.6667V5.33333C2 4.97778 2.13333 4.66667 2.4 4.4C2.66667 4.13333 2.97778 4 3.33333 4H20.6667C21.0222 4 21.3333 4.13333 21.6 4.4C21.8667 4.66667 22 4.97778 22 5.33333V18.6667C22 19.0222 21.8667 19.3333 21.6 19.6C21.3333 19.8667 21.0222 20 20.6667 20H3.33333ZM4 18H20V6H4V18Z" />',
    options: {
      src: {
        type: FormFieldType.Text,
        width: 100,
      },
      autoplay: { type: FormFieldType.Boolean },
      controls: { type: FormFieldType.Boolean },
      loop: { type: FormFieldType.Boolean },
      muted: { type: FormFieldType.Boolean },
      preload: {
        type: FormFieldType.Select,
        options: [
          { value: VideoPreload.Auto },
          { value: VideoPreload.Metadata },
          { value: VideoPreload.None },
        ],
      },
      aspectRatio: {
        type: FormFieldType.Select,
        options: [
          { value: VideoAspectRatio['9/1'] },
          { value: VideoAspectRatio['21/9'] },
          { value: VideoAspectRatio['16/9'] },
          { value: VideoAspectRatio['4/3'] },
        ],
      },
      playsInline: { type: FormFieldType.Boolean, label: 'Plays inline' },
    },
  };
