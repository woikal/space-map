import {AmbientLight, DirectionalLight} from "three";

function createDirectionalLight() {
    const speed = 0.3;
    let ref = 0;
    const light = new DirectionalLight(0xffffcc, 1.0);

    light.tick = (delta) => {
        ref += speed * delta;
        light.position.x = Math.sin(ref);
        light.position.z = Math.cos(ref);
        light.position.y = light.position.x / 2;
    };

    return light;
}

function createAmbientLight() {
    return new AmbientLight(0xffffdd, 0.5);
}

export {createAmbientLight, createDirectionalLight};