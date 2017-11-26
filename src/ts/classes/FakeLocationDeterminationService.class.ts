import {LocationDeterminationService} from "../interfaces/LocationDeterminationService.interface";
import {DynamicEarthCoordinate} from "../interfaces/EarthCoordinate.interface";

export class FakeLocationDeterminationService implements LocationDeterminationService {

    constructor() {
        // Do nothing
    }

    public getCurrentPosition(): Promise<DynamicEarthCoordinate> {
        return new Promise<DynamicEarthCoordinate>((resolve) => {
            resolve({
                timestamp: Math.round((new Date()).getTime() / 1000),
                // Deliver fake TechFak coordinates:
                longitude: 49.5733284,
                latitude: 11.0255971,
            });
        });
    }
}