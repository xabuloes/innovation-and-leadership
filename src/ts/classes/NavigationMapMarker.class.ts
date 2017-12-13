import {Color, ConeGeometry, Mesh, MeshBasicMaterial, Vector3} from "three";

export class MapMarker extends Mesh {

    private animation: TWEEN.Tween;

    constructor(height?: number, color?: Color) {
        super();

        height = height || 20;
        color = color || new Color(0xff0000);

        this.geometry = new ConeGeometry(5, height, 8);
        this.material = new MeshBasicMaterial({color});

        this.position.setY(height / 2);
        this.rotateZ(Math.PI);

    }

    public startOscilating(): void {

        this.stopOscilating();

        const endPositionOsci: Vector3 = new Vector3().copy(this.position);
        endPositionOsci.y += 5;

        /* tslint:disable */
        const self: MapMarker = this;

        const position: Vector3 = new Vector3().copy(self.position);

        this.animation = new TWEEN.Tween(position)
            .to(endPositionOsci, 1000)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function () {
                self.position.set(position.x, position.y, position.z);
            })
            .repeat(Infinity)
            .start();

        /* tslint:enable */

    }

    public stopOscilating(): void {

        if (typeof this.animation !== "undefined") {
            TWEEN.remove(this.animation);
        }

    }
}
