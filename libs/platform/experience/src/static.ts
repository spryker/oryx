/**
 * Do NOT export any async services files in the main entry points, as we'd break lazy loading otherwise.
 * All services artifacts are publicly available in a static entry point, to allow for customizations.
 */

export * from './services/layout/plugins/static';
