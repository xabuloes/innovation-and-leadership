import {DynamicEarthCoordinate, EarthCoordinate} from "./EarthCoordinate.interface";

export interface LocationDeterminationService {

    /**
     *
     *
     * @returns {Promise<EarthCoordinate>}
     */
    getCurrentPosition(): Promise<DynamicEarthCoordinate>;


}