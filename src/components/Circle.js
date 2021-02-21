import {BufferGeometry, LineLoop, Vector3} from "three";

function createCircle(center, radius, segments, material) {
    const points = []
    const angle = 2 * Math.PI / segments;

    for (let i = 0; i < segments; i++) {
        const phi = angle * i;
        points.push(new Vector3(Math.sin(phi) * radius, 0, Math.cos(phi) * radius));
    }

    const geometry = new BufferGeometry().setFromPoints(points);
    const loop = new LineLoop(geometry, material);
    loop.position.add(center);

    return loop;
}

export {createCircle};