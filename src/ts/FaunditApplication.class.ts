import * as THREE from "three";
import {MapMarker} from "./classes/NavigationMap/NavigationMapMarker.class";
import {NavigationMap} from "./classes/NavigationMap/NavigationMap.class";
import {LocationDeterminationService} from "./interfaces/LocationDeterminationService/LocationDeterminationService.interface";
import {inject, injectable} from "inversify";
import "reflect-metadata";
import {
    DynamicEarthCoordinate,
    EarthCoordinate
} from "./interfaces/LocationDeterminationService/EarthCoordinate.interface";
import * as $ from "jquery";
import {RoomDatabaseConnector} from "./interfaces/RoomDatabase/RoomDatabaseConnector.interface";
import {RoomData} from "./interfaces/RoomDatabase/RoomData.interface";
import {UserProfileService} from "./interfaces/UserProfileService/UserProfileService.interface";
import {DEPENDENCY_IDENTIFIER as DI} from "./DependencyIdentifier.const";
import {LectureDatabaseConnector} from "./interfaces/LectureDatabase/LectureDatabaseConnector.interface";
import {LectureData} from "./interfaces/LectureDatabase/LectureData.interface";

declare const openRoomSidebar: Function;

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

    private marker: MapMarker<RoomData>;

    private map: NavigationMap;

    private rayCaster: THREE.Raycaster;

    private lighting: THREE.Light;

    private controls: THREE.OrbitControls;

    private currentAvailableRoomData: RoomData[];

    private roomMarkers: MapMarker<RoomData>[];

    constructor(@inject(DI.USER_PROFILE_SERVICE) private userProfileService: UserProfileService,
                @inject(DI.ROOM_DATABASE_CONNECTOR) private roomDatabaseConnector: RoomDatabaseConnector,
                @inject(DI.LOCATION_DETERMINATION_SERVICE) private locationDeterminationService: LocationDeterminationService,
                @inject(DI.LECTURE_DATABASE_CONNECTOR) private lectureDatabaseConnector: LectureDatabaseConnector) {

        document.addEventListener("mousemove", (event) => {
            event.preventDefault();

            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        document.addEventListener("mousedown", (event) => {
            const mouse: THREE.Vector2 = new THREE.Vector2(0, 0);

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.rayCaster.setFromCamera(mouse, this.camera);
            const intersects = this.rayCaster.intersectObjects(this.roomMarkers);
            if (intersects.length > 0) {

                const marker: MapMarker<RoomData> = <MapMarker<RoomData>>intersects[0].object;

                this.showRoomInformation(marker.getData());

            } else {
                // TODO
            }

        });

        this.installEventHandlers();

        this.showTodaysLecturesBasedOnUserData()
            .then(() => {
                // TODO
            });

        this.rayCaster = new THREE.Raycaster();

        this.lighting = new THREE.DirectionalLight(0xffffff, 2.0);
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

        this.roomMarkers = [];

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

                        const newMarker: MapMarker<void> = this.map.setMarker(position, 0x0000ff);

                        this.camera.lookAt(newMarker.position);
                    });

                this.render();
            });

    }

    private showTodaysLecturesBasedOnUserData(): Promise<void> {

        console.log(this.lectureDatabaseConnector);

        return this.lectureDatabaseConnector.getLectureDataForToday()
            .then((todaysLectures: LectureData[]) => {

                // TODO

                // <li class="current-lecture">
                // <div class="current-lecture-title">Algorithmen & Datenstrukturen</div>
                //     <div class="current-lecture-time">in 2 hours</div>
                // <button class="current-lecture-goto">Show on map</button>
                // </li>

                alert(`Found ${todaysLectures.length} lecture(s) for today.`);

            });

    }

    private showRoomInformation(roomData: RoomData) {

        if (roomData !== null) {

            openRoomSidebar();

            const roomName: any = document.getElementById("room-info-name");
            const roomBuilding: any = document.getElementById("room-info-building");
            const roomEquipment: any = document.getElementById("room-info-equipment");
            const roomDescription: any = document.getElementById("room-info-description");
            const roomEngagement: any = document.getElementById("room-info-engaged");
            const roomAvailability: any = document.getElementById("room-info-availability");

            roomName.innerText = `${roomData.id} (${roomData.capacity} seats)`;
            roomBuilding.innerText = roomData.buildingName;

            roomEquipment.innerHTML =
                `<p>${(roomData.hasBeamer) ? ("&#x2714;") : ("&#x274c;")} Beamer</p>`
                + `<p>${(roomData.hasAudio) ? ("&#x2714;") : ("&#x274c;")} Audio</p>`
                + `<p>${(roomData.hasBoard) ? ("&#x2714;") : ("&#x274c;")} Board</p>`;

            roomDescription.innerText = roomData.description;

            roomEngagement.innerHTML = `Currently, there is <b>Algorithmen und Datenstrukturen (Tafelübung)</b> in progress.`;

            roomAvailability.innerHTML = `This room is available from <b>15:00</b> on.`;

        } else {
            alert("No room information available!");
        }
    }

    private showOnMap(roomData: RoomData): Promise<boolean> {

        return new Promise((resolve, reject) => {

            if (!this.map.isLocationOnMap(roomData.location)) {
                alert(`Room "${roomData.id}" is not part of the map!`);
                return resolve(false);
            } else {

                const marker: MapMarker<RoomData> = this.map.setRoomMarker(roomData.location, roomData);

                this.roomMarkers.push(marker);

                this.slowlyLookAt(marker.position, 2500)
                    .then(() => {

                        return resolve(true);
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

                })
                .onComplete(() => {
                    resolve();
                });
            /* tslint:enable */

        });

    }

    private installEventHandlers(): void {

        // TODO: Add handler for goto map

        $("#goto-map").click(() => {

            // TODO
            $("#start-view").addClass("animated fadeOutUp");

        });

        $("#submit-room-search").click((e) => {

            e.preventDefault();

            const roomIdParam: any = $("#room-search-string").val();

            if (typeof roomIdParam === "string") {
                if (roomIdParam.length > 0) {

                    this.roomDatabaseConnector.getDataForRooms(roomIdParam)
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

                                        if (this.map.isLocationOnMap(roomData.location)) {
                                            this.showRoomInformation(roomData);
                                        }

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
