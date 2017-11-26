// TODO Introduce NavigationMap for OBJ files
import {Box3, BoxHelper, Color, Group, MTLLoader, Object3D, OBJLoader} from "three";
import {EarthCoordinate} from "../interfaces/EarthCoordinate.interface";
import {MapMarker} from "./NavigationMapMarker.class";
import {Contract} from "typedcontract";

export class NavigationMap {

    private _mapMesh: Group;

    private _objLoader: OBJLoader;

    private _mtlLoader: MTLLoader;

    private _min: EarthCoordinate;
    private _max: EarthCoordinate;

    private _worldDx: number;
    private _worldDz: number;

    private _longitudeDelta: number;
    private _latitudeDelta: number;

    private boundingBox: Box3;

    constructor(min: EarthCoordinate, max: EarthCoordinate) {

        (new Contract()).In(min.longitude).isLessOrEqualThan(max.longitude);
        (new Contract()).In(min.latitude).isLessOrEqualThan(max.latitude);

        this._min = min;
        this._max = max;

        // TODO: Use DI instead
        this._objLoader = new OBJLoader();
        this._mtlLoader = new MTLLoader();

        this._mapMesh = new Object3D();

    }

    public get mapMesh(): Group {
        return this._mapMesh;
    }

    public loadMapMesh(pathTo3dData: string, pathToMaterialData: string, baseUrl: string): Promise<void> {

        // TODO: Make material optional

        return new Promise<void>((resolve, reject) => {

            this._mtlLoader.setBaseUrl(baseUrl);

            this._mtlLoader.load(pathToMaterialData,
                (loadedMtlFileMaterials: any) => {

                    loadedMtlFileMaterials.preload();

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


        }).then(() => {

            // Do map calculations
            const red: MapMarker = new MapMarker(40, new Color(0xff0000));
            const green: MapMarker = new MapMarker(40, new Color(0x00ff00));

            this.mapMesh.add(red);
            this.mapMesh.add(green);

            const boundingBoxHelper: BoxHelper = new BoxHelper(this.mapMesh);

            boundingBoxHelper.geometry.computeBoundingBox();

            this.boundingBox = boundingBoxHelper.geometry.boundingBox;

            red.position.setX(this.boundingBox.min.x);
            red.position.setZ(-this.boundingBox.min.z);

            green.position.setX(this.boundingBox.max.x);
            green.position.setZ(-this.boundingBox.max.z);

            this._worldDx = Math.abs(this.boundingBox.max.x - this.boundingBox.min.x);
            this._worldDz = Math.abs((-this.boundingBox.max.z) - (-this.boundingBox.min.z));

            this._longitudeDelta = Math.abs(this._max.longitude - this._min.longitude);
            this._latitudeDelta = Math.abs(this._max.latitude - this._min.latitude);

        });

    }

    public setMarkerOnLocation(location: EarthCoordinate): void {

        const newMarker: MapMarker = new MapMarker(20, new Color(0xff0000));

        const minWorldCoordinateX: number = (+this.boundingBox.min.x);
        const minWorldCoordinateZ: number = (-this.boundingBox.min.z);

        const worldCoordinatePerLongitudeUnit: number = this._worldDx / this._longitudeDelta;
        const worldCoordinatePerLatitudeUnit: number = this._worldDz / this._latitudeDelta;

        const latRelativeToMinimumLat: number = location.latitude - this._min.latitude;
        const lonRelativeToMinimumLon: number = location.longitude - this._min.longitude;

        this.mapMesh.add(newMarker);

        const relWorldPositionToMinimumX: number = lonRelativeToMinimumLon * worldCoordinatePerLongitudeUnit;
        const relWorldPositionToMinimumZ: number = latRelativeToMinimumLat * worldCoordinatePerLatitudeUnit;

        newMarker.position.setX(minWorldCoordinateX + relWorldPositionToMinimumX);
        newMarker.position.setZ(minWorldCoordinateZ - relWorldPositionToMinimumZ);

    }

}