import * as THREE from "three";

export class MapMarker extends THREE.Mesh {

    constructor(size: number, color: THREE.Color) {
        super();
        this.geometry = new THREE.BoxGeometry(size, size, size);
        this.material = new THREE.MeshBasicMaterial({color});
    }
}
