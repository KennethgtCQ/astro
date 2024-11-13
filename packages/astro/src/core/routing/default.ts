import type { ComponentInstance, ManifestData } from '../../types/astro.js';
import type { SSRManifest } from '../app/types.js';
import { DEFAULT_404_COMPONENT } from '../constants.js';
import {
	SERVER_ISLAND_COMPONENT,
	SERVER_ISLAND_ROUTE,
	createEndpoint as createServerIslandEndpoint,
	ensureServerIslandRoute,
} from '../server-islands/endpoint.js';
import {
	DEFAULT_404_ROUTE,
	default404Instance,
	ensure404Route,
} from './astro-designed-error-pages.js';

export function injectDefaultRoutes(ssrManifest: SSRManifest, routeManifest: ManifestData) {
	ensure404Route(routeManifest);
	ensureServerIslandRoute(ssrManifest, routeManifest);
	return routeManifest;
}

type DefaultRouteParams = {
	instance: ComponentInstance;
	matchesComponent(filePath: URL): boolean;
	route: string;
	component: string;
};

export function createDefaultRoutes(manifest: SSRManifest): DefaultRouteParams[] {
	const root = new URL(manifest.hrefRoot);
	return [
		{
			instance: default404Instance,
			matchesComponent: (filePath) => filePath.href === new URL(DEFAULT_404_COMPONENT, root).href,
			route: DEFAULT_404_ROUTE.route,
			component: DEFAULT_404_COMPONENT,
		},
		{
			instance: createServerIslandEndpoint(manifest),
			matchesComponent: (filePath) => filePath.href === new URL(SERVER_ISLAND_COMPONENT, root).href,
			route: SERVER_ISLAND_ROUTE,
			component: SERVER_ISLAND_COMPONENT,
		},
	];
}
