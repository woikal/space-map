import {
    BoxGeometry,
    BufferGeometry,
    Color,
    GridHelper,
    Line,
    LineBasicMaterial,
    Mesh,
    MeshPhongMaterial,
    Points,
    PointsMaterial
} from "three";
import {createCircle} from "./Circle";
import {map, toVector3} from "../services/helper";


const lineMaterial = new LineBasicMaterial({color: 0x333399, linewidth: 1, linecap: 'round', linejoin: 'round'});

const sectorColor = new Color(0x2194ce);

export class ObjectBuilder {

    constructor(satelliteOffsets) {
        this.offsets = satelliteOffsets;
    }

    createOrbit(target, parent, baseline) {
        const center = this.getCenter(parent);
        const projection = this.getCenter(target);
        const radius = center.setY(baseline).distanceTo(projection.setY(baseline));

        return createCircle(center, radius, 64, lineMaterial);
    }

    createOffsetLine(target, parent, baseline) {
        // const center = this.getCenter(parent); // for diagonal
        const projection = this.getCenter(target);
        const points = [];
        points.push(projection.clone());
        points.push(projection.setY(baseline));
        const geometry = new BufferGeometry().setFromPoints(points);

        return new Line(geometry, lineMaterial);
    }

    createAsteroids(asteroids) {
        const material = new PointsMaterial({color: 0x9b9bac2, size: 2.0});
        const geometry = new BufferGeometry();
        asteroids.forEach(asteroid => geometry.vertices.push(asteroid.position.scale(0.001)));

        return new Points(geometry, material);
    }

    createSector(reference, size, density, maxDensity) {
        const material = new MeshPhongMaterial({
            color: sectorColor,
            transparent: true,
            opacity: map(density, maxDensity, 0.8, 0, 0.2),
            //       side: DoubleSide,
            wireframe: false
        });
        const geometry = new BoxGeometry(size, size, size);
        const cube = new Mesh(geometry, material);
        cube.position.add(reference)

        return cube;
    }

    createStructures(structures) {
        const points = [];
        structures.forEach(structure => {
            points.push(toVector3(structure.position));
        });
        const geometry = new BufferGeometry().setFromPoints(points);
        const material = new PointsMaterial({
            color: 0x36ff36,
            size: 3
        });
        return new Points(geometry, material)
    }

    createGrid(size, yOffsetScale) {
        const grid = new GridHelper(size * 2.0, 20, 0x808080, 0x303030);
        grid.position.setY(size * yOffsetScale);

        return grid;
    }

    getCenter(satellite) {
        const center = toVector3(satellite.position);
        if (this.offsets.has(satellite.type)) {
            center.add(this.offsets.get(satellite.type));
        }
        return center;
    }
}
