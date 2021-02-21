import {parseHex, toVector3} from "../services/helper";
import {
    BufferGeometry,
    Color,
    Line,
    Mesh,
    MeshLambertMaterial,
    Points,
    PointsMaterial,
    SphereBufferGeometry
} from "three";
import {fibonacciSphere} from "./FibonacciSphere";

export class Satellite {
    constructor(params, offsets) {
        this.name = params.name || 'unknown';
        this.parent = params.parent || null;
        this.children = [];
        this.type = params.type || 'planet';
        this.radius = params.radius || 30;
        this.color = new Color(parseHex(params.color || '#99AA33'));

        this.center = toVector3(params.position);
        if (offsets.has(this.type)) this.center.add(offsets.get(this.type));

    }

    addChild(satellite) {
        this.children.push(satellite);
        satellite.parent = this;
    }

    getLambertObject() {
        const size = this.radius * 1.98;
        const wSegs = Math.max(8, Math.floor(this.radius * 0.9));
        const hSegs = Math.max(6, Math.floor(this.radius * 0.5));
        const geometry = new SphereBufferGeometry(size, wSegs, hSegs);

        // const material = new PointsMaterial({color: this.color, size: 10, wireframe: true});
        // const sphere = new Points(geometry, material);
        const material = new MeshLambertMaterial({visible: false, color: this.color, wireframe: false});
        const sphere = new Mesh(geometry, material);
        sphere.position.add(this.center);

        return sphere;
    }

    getPointObject() {
        const s = this.radius * 2;
        const points = fibonacciSphere(Math.round(this.radius * 58));
        const geometry = new BufferGeometry().setFromPoints(points).scale(s, s, s);

        const material = new PointsMaterial({color: this.color, size: 1});
        const pointCloud = new Points(geometry, material);
        pointCloud.position.add(this.center);

        pointCloud.tick = delta => {
            pointCloud.rotateY(delta * 0.1);
        };

        return pointCloud;
    }

    tick() {
        //n animate
    }
}