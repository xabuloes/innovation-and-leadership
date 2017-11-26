import {LocationDeterminationService} from "../interfaces/LocationDeterminationService.interface";
import {DynamicEarthCoordinate} from "../interfaces/EarthCoordinate.interface";
import {injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class FakeLocationDeterminationService implements LocationDeterminationService {

    private fakeCoordinates: any;

    constructor() {
        // Do nothing

        this.fakeCoordinates = {
            tentorium: {
                longitude: 11.028486,
                latitude: 49.573727,
            },
            faps: {
                longitude: 11.025575,
                latitude: 49.573981,
            }
        };

    }

    public getCurrentPosition(): Promise<DynamicEarthCoordinate> {
        return new Promise<DynamicEarthCoordinate>((resolve) => {
            resolve({
                timestamp: Math.round((new Date()).getTime() / 1000),
                // Deliver fake TechFak coordinates:
                ...this.fakeCoordinates.faps
            });
        });
    }
}