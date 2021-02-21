import {Vector3} from "three";

export function fibonacciSphere(samples = 100) {
    samples = Math.max(Math.min(10000, samples), 10);

    const samplesMinus = samples - 1;
    const ga = Math.PI * (3. - Math.sqrt(5.));  // golden angle in radians
    const points = [];

    for (let i = 0; i < samples; i++) {
        const y = 1 - (i * 2 / samplesMinus); // y between from 1 to - 1
        const radius = Math.sqrt(1 - y * y); // radius at y

        const theta = ga * i; // golden angle increment

        const x = Math.cos(theta) * radius
        const z = Math.sin(theta) * radius

        points.push(new Vector3(x, y, z));
    }
    return points;
}


