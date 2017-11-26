import {LocationDeterminationService} from "../interfaces/LocationDeterminationService.interface";
import {DynamicEarthCoordinate} from "../interfaces/EarthCoordinate.interface";
import {injectable} from "inversify";
import "reflect-metadata";
import {PointsOfInterests} from "../map_data/techfak/PointsOfInterest.list";
import {PointOfInterest} from "../interfaces/PointOfInterest.interface";

@injectable()
export class FakeLocationDeterminationService implements LocationDeterminationService {

    private _fakeLocations: any;

    constructor() {

        // Use fixed POI locations as set of locations to choose from randomly
        this._fakeLocations = PointsOfInterests.map((pointOfInterest: PointOfInterest) => pointOfInterest.location);

    }

    public getCurrentPosition(): Promise<DynamicEarthCoordinate> {
        return new Promise<DynamicEarthCoordinate>((resolve) => {
            resolve({
                timestamp: Math.round((new Date()).getTime() / 1000),
                // Deliver fake TechFak coordinates:
                ...this._fakeLocations[0] // TODO: Make random
            });
        });
    }
}