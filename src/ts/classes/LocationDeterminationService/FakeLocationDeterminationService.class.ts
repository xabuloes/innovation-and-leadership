import {LocationDeterminationService} from "../../interfaces/LocationDeterminationService/LocationDeterminationService.interface";
import {DynamicEarthCoordinate} from "../../interfaces/LocationDeterminationService/EarthCoordinate.interface";
import {injectable} from "inversify";
import "reflect-metadata";
import {PointsOfInterests} from "../../map_data/techfak/PointsOfInterest.list";
import {PointOfInterest} from "../../interfaces/LocationDeterminationService/PointOfInterest.interface";

@injectable()
export class FakeLocationDeterminationService implements LocationDeterminationService {

    private _fakeLocations: any;

    constructor() {
        // TODO
    }

    public getCurrentPosition(): Promise<DynamicEarthCoordinate> {
        return new Promise<DynamicEarthCoordinate>((resolve) => {
            resolve(<DynamicEarthCoordinate>{
                timestamp: Math.round((new Date()).getTime() / 1000),
                // Deliver fake TechFak coordinates:
                longitude: 11.030513,
                latitude: 49.573643
            });
        });
    }
}