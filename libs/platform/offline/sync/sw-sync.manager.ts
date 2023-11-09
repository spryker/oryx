/// <reference lib="WebWorker" />

declare global {
    interface ServiceWorkerRegistration {
      /** SyncManager is optional as it's only available after PWA installation */
      sync?: SyncManager;
    }
  
    /**
     * The SyncManager interface of the ServiceWorker API
     * provides an interface for registering and listing sync registrations
     * @see https://developer.mozilla.org/en-US/docs/Web/API/SyncManager
     */
    interface SyncManager {
      /** Create a new sync registration and return a Promise */
      register(tag: string): Promise<void>;
      /** Return a list of developer-defined identifiers for SyncManager registration */
      getTags(): Promise<string[]>;
    }
  
    interface SyncExtendableEvent extends ExtendableEvent {
      tag: string;
    }
  
    interface ServiceWorkerGlobalScopeEventMap extends WorkerGlobalScopeEventMap {
      sync: SyncExtendableEvent;
    }
  }
  
  export {};
  