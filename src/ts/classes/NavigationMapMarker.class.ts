import * as THREE from "three";

export class MapMarker extends THREE.Mesh {

    constructor(height?: number, color?: THREE.Color) {
        super();

        height = height || 20;
        color = color || new THREE.Color(0xff0000);

        this.geometry = new THREE.ConeGeometry(5, height, 8);
        this.material = new THREE.MeshBasicMaterial({color});

        this.position.setY(height / 2);
        this.rotateZ(Math.PI);
    }
}
