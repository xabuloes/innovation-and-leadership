import {LocationDeterminationService} from "../interfaces/LocationDeterminationService.interface";
import {DynamicEarthCoordinate, EarthCoordinate} from "../interfaces/EarthCoordinate.interface";
import {injectable} from "inversify";
import {Contract} from "typedcontract";

@injectable()
export class GPSLocationDeterminationService implements LocationDeterminationService {

    private navigator: Navigator;

    constructor() {

        (new Contract()).In(navigator)
            .isNotNull("navigator should not be null!");
        (new Contract()).In(navigator.geolocation)
            .isNotNull("navigator.geolocation should not be null!");
        (new Contract()).In(navigator.geolocation.getCurrentPosition)
            .isNotNull("getCurrentPosition() should not be null!");

        // One-shot position request.
        this.navigator = navigator;

    }

    public getCurrentPosition(): Promise<DynamicEarthCoordinate> {
        return new Promise<DynamicEarthCoordinate>((resolve, reject) => {

            // TODO: Encapsulate in RealGPSService
            this.navigator.geolocation.getCurrentPosition(
                (position: Position) => {
                    resolve({
                        timestamp: position.timestamp,
                        longitude: position.coords.longitude,
                        latitude: position.coords.latitude,
                    });
                },
                () => {
                    reject(new Error("Could not access Geolocation API. Please reload and allow access."));
                });
        });
    }
}