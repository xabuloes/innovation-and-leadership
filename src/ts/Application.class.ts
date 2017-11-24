import * as THREE from "three";
import {MapMarker} from "./Brick.class";
import {MTLLoader, OBJLoader} from "three";

declare const loadAdditionalThreeJsDependencies: Function;

class Application {

    private readonly renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: <HTMLCanvasElement>document.getElementById("mainCanvas")
    });

    private readonly scene = new THREE.Scene();
    private readonly camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 10000);

    private marker: MapMarker;

    private map: THREE.Group;

    private rayCaster: THREE.Raycaster;

    private lighting: THREE.Light;

    private mouse: THREE.Vector2 = new THREE.Vector2(0, 0);

    constructor() {

        loadAdditionalThreeJsDependencies(THREE);

        document.addEventListener("mousemove", (event) => {
            event.preventDefault();

            this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            this.mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
        });

        this.rayCaster = new THREE.Raycaster();

        this.lighting = new THREE.DirectionalLight(0xffffff);
        this.scene.add(this.lighting);

        this.marker = new MapMarker(5, new THREE.Color("rgb(0,0,255)"));
        this.scene.add(this.marker);

        this.camera.position.set(80, 80, 80);
        this.renderer.setSize(innerWidth, innerHeight);
        this.renderer.setClearColor(new THREE.Color("rgb(0,0,0)"));
        this.camera.lookAt(<THREE.Vector3>{x: 0, y: 0, z: 0});

        let loadMap: () => Promise<void> = () => {

            return new Promise((resolve, reject) => {

                const objLoader: OBJLoader = new OBJLoader();
                const mtlLoader: MTLLoader = new MTLLoader();

                const url: any = window.location;
                const baseUrl: string = url.protocol + "//" + url.host + "/" + url.pathname.split('/')[1];

                alert(baseUrl);
                mtlLoader.setBaseUrl(baseUrl);

                mtlLoader.load("assets/techfak_map.mtl",
                    (materials: any) => {

                        materials.preload();

                        objLoader.setMaterials(materials);

                        objLoader.load("assets/techfak_map.obj",
                            (object: THREE.Group) => {

                                this.map = object;

                                this.scene.add(this.map);

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

        };

        loadMap()
            .then(() => {
                this.render();
            });

    }

    private adjustCanvasSize() {
        this.renderer.setSize(innerWidth, innerHeight);
        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix();
    }

    private render() {
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(() => {
            this.render()
        });

        this.adjustCanvasSize();

        this.updateKeyboard();

        this.updateEnvironment();

    }

    private updateKeyboard(): void {


    }

    private updateEnvironment(): void {

        this.rayCaster.setFromCamera(this.mouse, this.camera);

        const intersects: THREE.Intersection[] = this.rayCaster.intersectObjects(this.map.children);

        if (intersects.length > 0) {

            if (intersects[0].object) {

                const pointedAt: THREE.Object3D = intersects[0].object;

                const pointerLabelTextField: any = document.getElementById("pointer-label");

                if (pointerLabelTextField) {
                    pointerLabelTextField.innerText = pointedAt.name;
                }

                console.log(pointedAt.getWorldPosition());

                this.camera.lookAt(pointedAt.position);

            }

        }


    }


}

const application: Application = new Application();
