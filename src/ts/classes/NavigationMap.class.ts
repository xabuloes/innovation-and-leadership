// TODO Introduce NavigationMap for OBJ files
import {Group, MTLLoader, Object3D, OBJLoader} from "three";
import {EarthCoordinate} from "../interfaces/EarthCoordinate.interface";

export class NavigationMap {

    private _mapMesh: Group;

    private _objLoader: OBJLoader;

    private _mtlLoader: MTLLoader;

    private _min: EarthCoordinate;
    private _max: EarthCoordinate;

    constructor(min: EarthCoordinate, max: EarthCoordinate) {

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


        });

    }

}