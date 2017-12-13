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

    private currentAvailableRoomData: RoomData[];

    private markers: MapMarker[];

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

        this.camera.position.set(180, 80, 80);
        this.renderer.setSize(innerWidth, innerHeight);
        this.renderer.setClearColor(new THREE.Color("rgb(0,0,0)"));

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

        this.markers = [];

        const url: any = window.location;
        const baseUrl: string = url.protocol + "//" + url.host + "/" + url.pathname.split("/")[1];

        this.map.loadMapMesh(
            "assets/techfak_map.obj",
            "assets/techfak_map.mtl",
            baseUrl)
            .then(() => {

                this.scene.add(this.map.mapMesh);

                this.locationDeterminationService.getCurrentPosition()
                    .then((position: DynamicEarthCoordinate) => {
                        console.log(position.timestamp, position.longitude, position.latitude);

                        const newMarker: MapMarker = this.map.setMarkerOnLocation(position, 0x0000ff);

                        this.markers.push(newMarker);

                        this.camera.lookAt(newMarker.position);
                    });

                this.render();
            });

    }

    private showOnMap(roomData: RoomData): Promise<void> {

        return new Promise((resolve, reject) => {

            if (!this.map.isLocationOnMap(roomData.location)) {
                alert(`Room "${roomData.id}" is not part of the map!`);
                return resolve();
            } else {

                const marker: MapMarker = this.map.setMarkerOnLocation(roomData.location);

                this.slowlyLookAt(marker.position, 2500)
                    .then(() => {

                        return resolve();
                    });

            }

        });
    }

    private slowlyLookAt(position: THREE.Vector3, duration: number): Promise<void> {

        return new Promise((resolve, reject) => {

            // backup original rotation
            const startRotation: THREE.Euler = new THREE.Euler().copy(this.camera.rotation);

            // final rotation (with lookAt)
            this.camera.lookAt(position);
            const endRotation: THREE.Euler = new THREE.Euler().copy(this.camera.rotation);

            // revert to original rotation
            this.camera.rotation.copy(startRotation);

            const camera: THREE.PerspectiveCamera = this.camera;

            const rotation: THREE.Euler = new THREE.Euler().copy(startRotation);

            /* tslint:disable */
            new TWEEN.Tween(rotation)
                .to(endRotation, duration)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start()
                .onUpdate(function () {
                    camera.rotation.x = rotation.x;
                    camera.rotation.y = rotation.y;
                    camera.rotation.z = rotation.z;

                    console.log(camera.rotation, rotation, endRotation);
                })
                .onComplete(() => {
                    resolve();
                });
            /* tslint:enable */

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

                            // TODO: Do we really need this?
                            this.currentAvailableRoomData = roomData;

                            if (roomData.length === 0) {

                                $("#search-result-list").append(`<li>No rooms found.</li>`);

                            } else {

                                roomData.forEach((roomData: RoomData) => {

                                    const newElement: JQuery = $(`<a href="#" class="w3-bar-item w3-button">${roomData.id} (${roomData.buildingName})</a>`);
                                    newElement.bind("click", () => {
                                        this.showOnMap(roomData)
                                            .then(() => {
                                                // TODO: Display room data
                                            });
                                    });

                                    $("#search-result-list").append(newElement);

                                });

                            }

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

        TWEEN.update();

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
