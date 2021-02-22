import {PerspectiveCamera, Scene, Vector3,} from "three";
import {Interaction} from "three.interaction";

import {Loop} from '/src/components/Loop.js';
import {Resizer} from '/src/components/Resizer.js';
import {createRenderer} from '/src/services/renderer.js';
import {createControls} from '/src/services/controls.js';
import {createAmbientLight, createDirectionalLight} from "./services/lights.js";
import {ObjectBuilder} from "./components/ObjectBuilder.js";
import {mapToSector} from "./services/helper";
import {Satellite} from "./components/Satellite";

let spaceMaxSize, offsets, baseline, sectorSize;
let asteroids;
let camera, scene, renderer, loop;

class SpaceMap {
    constructor(container, config, data) {
        spaceMaxSize = config.spaceMaxSize;
        baseline = -1000;

        offsets = new Map(Object.entries(config.offsets));
        offsets.forEach((offset, key) => {
            offsets.set(key, new Vector3(1, 1, 1).multiplyScalar(parseInt(offset) * 0.001));
        });

        sectorSize = 250;

        this.system = config.system;
        asteroids = data.asteroids;


        camera = new PerspectiveCamera(64, window.innerWidth / window.innerHeight, 1, spaceMaxSize * 4);
        camera.position.set(-1.3, 0.4, -1.3).multiplyScalar(spaceMaxSize * 1, 5);
        camer.whee

        this.builder = new ObjectBuilder(offsets);
        const sun = createDirectionalLight();
        const ambient = createAmbientLight();

        scene = new Scene();
        renderer = createRenderer();
        const resizer = new Resizer(container, camera, renderer);
        loop = new Loop(camera, scene, renderer);

        scene.add(sun);
        scene.add(ambient);
        scene.add(this.builder.createGrid(spaceMaxSize, 0.7));
        scene.add(this.builder.createGrid(spaceMaxSize, -0.7));

        this.addSystem(this.system);
        scene.add(this.builder.createAsteroids(data.asteroids));
        scene.add(this.builder.createAsteroids(data.safezones, 0xff9900,5));
        this.mapStructures(data.structures);


        const interaction = new Interaction(renderer, scene, camera);
        //const screenEvent = new ScreenEvent(camera, scene, renderer.domElement);

        const controls = createControls(camera, renderer.domElement);
        controls.maxDistance = spaceMaxSize * 2.0;


        loop.updatables.push(sun);
        loop.updatables.push(controls);

        container.innerHTML = '';
        container.appendChild(renderer.domElement);
    }


    addSystem(satellites, parent = null) {
        satellites.forEach(satellite => {
            const satelliteObj = new Satellite(satellite, offsets);

            const pointMesh = satelliteObj.getPointObject();
            scene.add(pointMesh);
            loop.updatables.push(pointMesh);

            const touchMesh = satelliteObj.getLambertObject();
            scene.add(touchMesh);
            touchMesh.on('click', ev => this.sphereOnClick(ev));

            if (parent !== null) {
                scene.add(this.builder.createOrbit(satellite, parent, baseline));
                scene.add(this.builder.createOffsetLine(satellite, parent, baseline));
            } else {
                scene.add(this.builder.createOffsetLine(satellite, satellite, baseline));
            }

            if (satellite.satellites) {
                this.addSystem(satellite.satellites, satellite);
            }
        });
    }

    mapStructures(structures) {
        let sectors = new Map();
        let maxPerSector = 0;
        structures.forEach(structure => {
            const pos = mapToSector(structure.position, sectorSize);
            const key = pos.x + '|' + pos.y + '|' + pos.z;
            sectors.set(key, {
                pos: pos,
                count: sectors.has(key) ? 1 + sectors.get(key).count : 1
            });
            maxPerSector = Math.max(maxPerSector, sectors.get(key).count);
        });
        sectors.forEach(sector => {
            scene.add(this.builder.createSector(sector.pos, sectorSize, sector.count, maxPerSector))
        });
        scene.add(this.builder.createStructures(structures));
    }

    sphereOnClick(ev) {
        // console.log(this, ev.intersects);
    }

    start() {
        loop.start();
    }

    stop() {
        loop.stop();
    }
}

export {SpaceMap};