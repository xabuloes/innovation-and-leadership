// TODO Introduce NavigationMap for OBJ files
import {Box3, BoxHelper, Color, Group, MTLLoader, Object3D, OBJLoader, Vector2, Vector3} from "three";
import {EarthCoordinate} from "../../interfaces/LocationDeterminationService/EarthCoordinate.interface";
import {MapMarker} from "./NavigationMapMarker.class";
import {Contract} from "typedcontract";
import {RoomData} from "../../interfaces/RoomDatabase/RoomData.interface";

export class NavigationMap {

    private _mapMesh: Object3D;

    private _objLoader: OBJLoader;

    private _mtlLoader: MTLLoader;

    private _min: EarthCoordinate;
    private _max: EarthCoordinate;

    private _worldDx: number;
    private _worldDz: number;

    private _longitudeDelta: number;
    private _latitudeDelta: number;

    private _boundingBox: Box3;

    private _markers: MapMarker<any>[];

    constructor(min: EarthCoordinate, max: EarthCoordinate) {

        (new Contract()).In(min.longitude).isLessOrEqualThan(max.longitude);
        (new Contract()).In(min.latitude).isLessOrEqualThan(max.latitude);

        this._min = min;
        this._max = max;

        // TODO: Use DI instead
        this._objLoader = new OBJLoader();
        this._mtlLoader = new MTLLoader();

        this._mapMesh = new Object3D();

        this._markers = [];

    }

    public get mapMesh(): Group {
        return this._mapMesh;
    }

    public loadMapMesh(pathTo3dData: string, pathToMaterialData: string, baseUrl: string): Promise<void> {

        // TODO: Make material optional

        return new Promise<void>((resolve, reject) => {

            // TODO: Inject MTL loader
            this._mtlLoader.setBaseUrl(baseUrl);

            this._mtlLoader.load(pathToMaterialData,
                (loadedMtlFileMaterials: any) => {

                    loadedMtlFileMaterials.preload();

                    // TODO: Inject OBJ loader
                    this._objLoader.setMaterials(loadedMtlFileMaterials);

                    this._objLoader.load(pathTo3dData,
                        (loadedObjFileObject: Group) => {

                            this._mapMesh.add(loadedObjFileObject);

                            resolve();
                        },
                        (xhr: any) => {
                            // TODO
                        },
                        (error: any) => {
                            reject();
                        });

                },
                () => {
                    // TODO
                },
                (error: any) => {
                    reject();
                });


        });
    }

    /**
     * Map given earth coordinate onto the corresponding 3D position on the 3D map.
     *
     * @param {EarthCoordinate} location
     * @returns {Vector2}
     */
    private getWorldPositionFromCoordinate(location: EarthCoordinate): Vector2 {

        const boundingBoxHelper: BoxHelper = new BoxHelper(this.mapMesh);

        boundingBoxHelper.geometry.computeBoundingBox();

        this._boundingBox = boundingBoxHelper.geometry.boundingBox;

        this._worldDx = Math.abs(this._boundingBox.max.x - this._boundingBox.min.x);
        this._worldDz = Math.abs((-this._boundingBox.max.z) - (-this._boundingBox.min.z));

        this._longitudeDelta = Math.abs(this._max.longitude - this._min.longitude);
        this._latitudeDelta = Math.abs(this._max.latitude - this._min.latitude);

        const minWorldCoordinateX: number = (+this._boundingBox.min.x);
        const minWorldCoordinateZ: number = (-this._boundingBox.min.z);

        const worldCoordinatePerLongitudeUnit: number = this._worldDx / this._longitudeDelta;
        const worldCoordinatePerLatitudeUnit: number = this._worldDz / this._latitudeDelta;

        const latRelativeToMinimumLat: number = location.latitude - this._min.latitude;
        const lonRelativeToMinimumLon: number = location.longitude - this._min.longitude;

        const relWorldPositionToMinimumX: number = lonRelativeToMinimumLon * worldCoordinatePerLongitudeUnit;
        const relWorldPositionToMinimumZ: number = latRelativeToMinimumLat * worldCoordinatePerLatitudeUnit;

        return new Vector2(minWorldCoordinateX + relWorldPositionToMinimumX, minWorldCoordinateZ - relWorldPositionToMinimumZ);
    }

    /**
     *
     * @param {EarthCoordinate} location
     */
    public setMarker(location: EarthCoordinate, color?: number): MapMarker<void> {

        color = color || 0xff0000;

        /**
         * Setting up preconditions for coordinate value
         */
        (new Contract()).In(location.longitude)
            .isGreaterOrEqualThan(this._min.longitude)
            .isLessOrEqualThan(this._max.longitude);
        (new Contract()).In(location.latitude)
            .isGreaterOrEqualThan(this._min.latitude)
            .isLessOrEqualThan(this._max.latitude);

        // TODO: Extract some of those static calculations

        const newMarker: MapMarker<void> = new MapMarker<void>(undefined, 20, new Color(color));

        this.mapMesh.add(newMarker);

        const positionXY: Vector2 = this.getWorldPositionFromCoordinate(location);

        newMarker.position.setX(positionXY.x);
        newMarker.position.setZ(positionXY.y); // Y value maps to 3D Z value!

        newMarker.startOscilating();

        return newMarker;
    }

    /**
     *
     * @param {EarthCoordinate} location
     */
    public setRoomMarker(location: EarthCoordinate, data: RoomData /* TODO: Make generic? */, color?: number): MapMarker<RoomData> {

        this.clearMarkers();

        color = color || 0xffff00;

        /**
         * Setting up preconditions for coordinate value
         */
        (new Contract()).In(location.longitude)
            .isGreaterOrEqualThan(this._min.longitude)
            .isLessOrEqualThan(this._max.longitude);
        (new Contract()).In(location.latitude)
            .isGreaterOrEqualThan(this._min.latitude)
            .isLessOrEqualThan(this._max.latitude);

        // TODO: Extract some of those static calculations

        const newMarker: MapMarker<RoomData> = new MapMarker<RoomData>(data, 20, new Color(color));

        this.mapMesh.add(newMarker);

        const positionXY: Vector2 = this.getWorldPositionFromCoordinate(location);

        newMarker.position.setX(positionXY.x);
        newMarker.position.setZ(positionXY.y); // Y value maps to 3D Z value!

        newMarker.startOscilating();

        this._markers.push(newMarker);

        return newMarker;
    }

    public clearMarkers(): void {

        this._markers.forEach((marker: MapMarker<any>) => {
            this.removeMapMarker(marker);
        });

    }

    /**
     * TODO
     *
     * @param {MapMarker} markerToRemove
     */
    public removeMapMarker(markerToRemove: MapMarker<any>): void {

        this.mapMesh.remove(markerToRemove);
    }

    /**
     * TODO
     *
     * @param {EarthCoordinate} location
     * @returns {boolean}
     */
    public isLocationOnMap(location: EarthCoordinate): boolean {

        if ((location.longitude >= this._min.longitude && location.longitude < this._max.longitude)
            &&
            (location.latitude >= this._min.latitude && location.latitude < this._max.latitude)) {

            return true;
        } else {
            return false;
        }

    }

    public get3DPositionFromCoordinate(location: EarthCoordinate): Vector3 {

        // TODO
        throw new Error("Not implemented yet");

    }

}