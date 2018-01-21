/**
 *
 */
export interface EarthCoordinate {

    longitude: number;
    latitude: number;

}

/**
 *
 */
export interface DynamicEarthCoordinate extends EarthCoordinate {

    timestamp: number;

}
