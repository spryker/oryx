import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { VideoAspectRatio, VideoPreload } from '@spryker-oryx/ui/video';
import { ContentVideoComponent } from './video.component';

export const videoComponentSchema: ContentComponentSchema<ContentVideoComponent> =
  {
    name: 'Video',
    group: 'Content',
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
