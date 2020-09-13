import { Sponsor } from './sponsorsData'
import * as mapboxgl from 'mapbox-gl'

declare global {
	var mapboxgl: mapboxgl
	var MapBoxGeocoder: any

	interface Window {
		sponsorsData: Sponsor[]
		map: mapboxgl.Map
	}
}
