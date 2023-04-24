import { getInjector } from '@spryker-oryx/di';
import { DexieIndexedDbService } from '@spryker-oryx/indexed-db';
import { PickingListAdapter } from '@spryker-oryx/picking/src/services';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Decorators test`,
  parameters: { chromatic: { disableSnapshot: true } },
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`<div id="test-container"></div>`;
};

export const Demo = Template.bind({});

Demo.play = (): void => {
  const dexieIdbService = getInjector().inject(DexieIndexedDbService);
  const adapter = getInjector().inject(PickingListAdapter);

  dexieIdbService.getDb().subscribe(() => {
    adapter
      .get({})
      .subscribe(
        (e) =>
          (document.getElementById('test-container')!.innerHTML =
            JSON.stringify(e))
      );
  });
};
