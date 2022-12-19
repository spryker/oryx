import { addLink, addScript } from '@spryker-oryx/launchpad-ui';
import { AjaxClient } from '@spryker-oryx/utilities/typescript';
import { html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';

export interface EntryPoint {
  file: string;
  imports: string[];
  css: string[];
}
export interface Manifest {
  'index.ts': EntryPoint;
  [key: string]: { file: string };
}

export class MicroFrontendComponent extends LitElement {
  /* Required */
  @property() hosting?: string;
  /* Required */
  @property() name?: string;

  @state()
  private ready = false;
  @state()
  private error?: Error;

  render(): TemplateResult {
    if (this.error) {
      return html`<span data-testid="error"> ${this.error.message} </span>`;
    }

    if (!this.ready) {
      return this.renderLoading();
    }

    return this.renderMicroFrontend();
  }

  private renderLoading(): TemplateResult {
    return html`<span data-testid="loading-mask">Loading...</span>`;
  }

  private renderMicroFrontend(): TemplateResult {
    return html`<slot></slot>`;
  }

  private async loadMicroFrontend(): Promise<void> {
    if (!this.name) {
      throw new Error(`Please set the name of the micro frontend to load`);
    }

    if (!this.hosting) {
      throw new Error(
        `Please set the host where the micro frontend needs to be loaded`
      );
    }

    const manifest = await AjaxClient.get<Manifest>(
      `${this.hosting}/manifest.json`
    );

    const entryPoint = manifest['index.ts'];
    const vendors = entryPoint.imports.map((vendor) => manifest[vendor].file);
    const styles = entryPoint.css;

    await Promise.all([
      ...styles.map(async (style) =>
        addLink(`${this.hosting}/${style}`, {
          'data-app': this.name as string,
        })
      ),
      ...[...vendors, entryPoint.file].map(async (script) =>
        addScript(`${this.hosting}/${script}`, {
          type: 'module',
          'data-app': this.name as string,
        })
      ),
    ]);
  }

  async firstUpdated(): Promise<void> {
    try {
      if (!document.querySelector(`[data-app="${this.name}"]`)) {
        await this.loadMicroFrontend();
      }
      this.ready = true;
    } catch (e) {
      this.error = e as Error;
    }
  }
}
