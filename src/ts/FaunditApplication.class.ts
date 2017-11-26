import * as THREE from "three";
import {MapMarker} from "./classes/NavigationMapMarker.class";
import {NavigationMap} from "./classes/NavigationMap.class";
import {LocationDeterminationService} from "./interfaces/LocationDeterminationService.interface";
import {inject, injectable} from "inversify";
import "reflect-metadata";
import {DynamicEarthCoordinate, EarthCoordinate} from "./interfaces/EarthCoordinate.interface";
import * as $ from "jquery";
import {RoomDatabaseConnector} from "./interfaces/RoomDatabase/RoomDatabaseConnector.interface";
import {RoomData} from "./interfaces/RoomDatabase/RoomData.interface";

/**
 *
 */
@injectable()
export class FaunditApplication {

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

    @inject("locationDeterminationService")
    private locationDeterminationService: LocationDeterminationService;

    @inject("roomDatabaseConnector")
    private roomDatabaseConnector: RoomDatabaseConnector;

    constructor() {

        document.addEventListener("mousemove", (event) => {
            event.preventDefault();

            this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            this.mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
        });

        this.installEventHandlers();

        this.rayCaster = new THREE.Raycaster();

        this.lighting = new THREE.DirectionalLight(0xffffff, 1.5);
        this.lighting.position.set(0, 100, 0);

        this.scene.add(this.lighting);

        this.marker = new MapMarker(20, new THREE.Color("rgb(0,0,255)"));
        this.scene.add(this.marker);

        this.camera.position.set(80, 80, 80);
        this.renderer.setSize(innerWidth, innerHeight);
        this.renderer.setClearColor(new THREE.Color("rgb(0,0,0)"));
        this.camera.lookAt(<THREE.Vector3>{x: 0, y: 0, z: 0});

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        this.map = new NavigationMap(
            {
                latitude: 49.5688684,
                longitude: 11.0225915,
            },
            {
                latitude: 49.5767443,
                longitude: 11.0321187,
            }
        );

        const url: any = window.location;
        const baseUrl: string = url.protocol + "//" + url.host + "/" + url.pathname.split("/")[1];

        this.map.loadMapMesh(
            "assets/techfak_map.obj",
            "assets/techfak_map.mtl",
            baseUrl)
            .then(() => {

                this.scene.add(this.map.mapMesh);

                this.scene.add(new THREE.BoundingBoxHelper(this.map.mapMesh, 0xff0000));

                this.locationDeterminationService.getCurrentPosition()
                    .then((position: DynamicEarthCoordinate) => {
                        console.log(position.timestamp, position.longitude, position.latitude);

                        this.map.setMarkerOnLocation(position);
                    });

                this.render();
            });

    }

    private installEventHandlers(): void {

        $("#submit-room-search").click(() => {

            const roomIdParam: any = $("#room-search-string").val();

            if (typeof roomIdParam === "string") {
                if (roomIdParam.length > 0) {

                    this.roomDatabaseConnector.getRoomData(roomIdParam)
                        .then((roomData: RoomData[]) => {
                            // TODO

                            $("#search-result-list").empty();

                            roomData.forEach((roomData: RoomData) => {

                                $("#search-result-list").append(
                                    `<a href="#" class="w3-bar-item w3-button">${roomData.id} (${roomData.buildingName})</a>`
                                );

                            });


                        });

                }
            } else {
                // Do nothing
            }

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
            this.render();
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
