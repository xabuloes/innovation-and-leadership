// TODO Introduce NavigationMap for OBJ files
import {Group, MTLLoader, OBJLoader} from "three";

export class NavigationMap {

    private _mapMesh: Group;

    private objLoader: OBJLoader;

    private mtlLoader: MTLLoader;

    constructor() {

        // TODO: Use DI instead
        this.objLoader = new OBJLoader();
        this.mtlLoader = new MTLLoader();

        this._mapMesh = new Group();

    }

    public get mapMesh(): Group {
        return this._mapMesh;
    }

    public loadMapMesh(pathTo3dData: string, pathToMaterialData: string, baseUrl: string): Promise<void> {

        // TODO: Make material optional

        return new Promise<void>((resolve, reject) => {

            this.mtlLoader.setBaseUrl(baseUrl);

            this.mtlLoader.load(pathToMaterialData,
                (loadedMtlFileMaterials: any) => {

                    loadedMtlFileMaterials.preload();

                    this.objLoader.setMaterials(loadedMtlFileMaterials);

                    this.objLoader.load(pathTo3dData,
                        (loadedObjFileObject: Group) => {

                            this._mapMesh.add(loadedObjFileObject);

                            resolve();
                        },
                        (xhr: any) => {

                        },
                        (error: any) => {
                            reject();
                        });

                },
                () => {

                },
                (error: any) => {
                    reject();
                });


        });

    }

}