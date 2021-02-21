import {Vector2, Vector3} from "three";

/** Converts a position object with 2 coordinates to a 2D vector. */
export function toVector2(position, scale = 0.001) {
    const v3 = toVector3(position, scale);
    return new Vector2(v3.x, v3.z);
}

/** Converts a position object with 3 coordinates to a 3D vector. */
export function toVector3(position, scale = 0.001) {
    const [x, y, z] = [position.x, position.y, position.z];
    return new Vector3(parseInt(x), parseInt(y), parseInt(z)).multiplyScalar(scale);
}

/** Parses a hex representation with leading # to the respective int value. */
export function parseHex(string) {
    return parseInt(string.replace(/^#/, ''), 16);
}

/** Calculates the center position of the corresponding sector of the given coordinates */
export function mapToSector(position, size) {
    const sector = new Vector3(size, size, size);
    const reference = toVector3(position)
        .divideScalar(size)
        .floor();
    return sector.clone().multiply(reference).addScaledVector(sector, 0.5);
}

/** Maps a given value based on a maximum and optional minimum to a given range or [1..-1] by default. */
export function map(value, maxValue, maxRange = 1, minValue = -1, minRange = -1) {
    return minRange + Math.max(0, Math.min(1, (value - minValue) / (maxValue - minValue))) * (maxRange - minRange);
}
