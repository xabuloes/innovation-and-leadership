import * as THREE from "three";
import {MapMarker} from "./classes/NavigationMapMarker.class";
import {BoundingBoxHelper, Color, MTLLoader, OBJLoader, OrbitControls} from "three";
import {NavigationMap} from "./classes/NavigationMap.class";

declare const loadAdditionalThreeJsDependencies: Function;

class Application {

    private readonly renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: <HTMLCanvasElement>document.getElementById("mainCanvas")
    });

    private readonly scene = new THREE.Scene();
    private readonly camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 10000);
    private readonly mouse: THREE.Vector2 = new THREE.Vector2(0, 0);

    private marker: MapMarker;

    private map: NavigationMap;

    private rayCaster: THREE.Raycaster;

    private lighting: THREE.Light;

    private controls: THREE.OrbitControls;

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

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        this.map = new NavigationMap(
            {
                latitude: 11.0225915,
                longitude: 49.5688684,
            },
            {
                latitude: 11.0321187,
                longitude: 49.5767443,
            }
        );

        const url: any = window.location;
        const baseUrl: string = url.protocol + "//" + url.host + "/" + url.pathname.split('/')[1];

        this.map.loadMapMesh(
            "assets/techfak_map.obj",
            "assets/techfak_map.mtl",
            baseUrl)
            .then(() => {

                this.scene.add(this.map.mapMesh);

                this.scene.add(new BoundingBoxHelper(this.map.mapMesh, 0xff0000));

                const a: MapMarker = new MapMarker(10, new Color(0xff0000));
                const b: MapMarker = new MapMarker(10, new Color(0x00ff00));

                this.scene.add(a);
                this.scene.add(b);

                b.position.set(0, 3, 0);

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

        this.updateEnvironment();

    }

    private updateEnvironment(): void {

        this.rayCaster.setFromCamera(this.mouse, this.camera);

        const intersects: THREE.Intersection[] = this.rayCaster.intersectObjects(this.map.mapMesh.children[0].children);


        if (intersects.length > 0) {

            if (intersects[0].object) {

                const pointedAt: THREE.Object3D = intersects[0].object;

                const pointerLabelTextField: any = document.getElementById("pointer-label");

                if (pointerLabelTextField) {
                    pointerLabelTextField.innerText = pointedAt.name;
                }

            }

        }


    }


}

const application: Application = new Application();
