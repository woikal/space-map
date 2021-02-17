import {
    BufferGeometry,
    CircleGeometry,
    GridHelper,
    HemisphereLight,
    Line,
    LineBasicMaterial,
    LineLoop,
    Mesh,
    MeshLambertMaterial,
    PerspectiveCamera,
    Points,
    PointsMaterial,
    Scene,
    SphereBufferGeometry,
    Vector3,
    WebGLRenderer
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Geometry} from "three/examples/jsm/deprecated/Geometry";

let spaceMaxSize, worldCenter;
let planets, asteroids, structures, light;
let camera, scene, controls, renderer;

class SpaceMap {
    constructor(container, config, data) {
        spaceMaxSize = config.spaceMaxSize;
        worldCenter = config.worldCenter;
        planets = config.planets;

        asteroids = data.asteroids;
        structures = data.structures;

        camera = new PerspectiveCamera(64, ww / wh, 1, spaceMaxSize * 3.5);
        // let helper = new CameraHelper(camera);
        // scene.add(helper);

        scene = new Scene();

        camera.position.set(spaceMaxSize * -1.0, spaceMaxSize * 0.4, spaceMaxSize * -0.3);
        controls = new OrbitControls(camera);
        controls.maxDistance = spaceMaxSize * 2.0;
        controls.update();

        this.addLights();
        this.addGrids();
        planets.forEach(planet => this.addBody(planet, worldCenter));

        // this.asteroids.forEach(roid => addAsteroids(roid));
        // this.structure.forEach(structure => addStructure(structure));

        renderer = new WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);

        container.innerHTML = '';
        container.appendChild(renderer.domElement);

        window.addEventListener('resize', this.onWindowResize);
    }


    onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
       camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }


    onBodyMouseDown(evt) {
        evt.preventDefault();
        console.log(evt)
    }


    addLights() {
        light = new HemisphereLight(0xffffff, 0x181818, 0.9);
        light.position.set(-20, 10, 1);
        scene.add(light);
    }

    scalar(components) {
        let sum = 0;
        components.forEach(c => sum += c * c);
        return Math.sqrt(sum);
    };

    parseHex(string) {
        return parseInt(string.replace(/^#/, ''), 16);
    }


    addOrbit(center, pos) {

        let material = new LineBasicMaterial({color: 0x333399, linewidth: 1, linecap: 'round', linejoin: 'round'});

        let geometry = new CircleGeometry(this.scalar([pos.x - center.x, pos.z - center.z]), 64);
        geometry.vertices.shift();
        geometry.rotateX(Math.PI / 2);
        geometry.translate(center.x, center.y, center.z);
        let circle = new LineLoop(geometry, material);
        this.scene.add(circle);

        const points = [];
        points.push(new Vector3(pos.x, center.y, pos.z));
        points.push(new Vector3(pos.x, pos.y, pos.z));
        geometry = new BufferGeometry().setFromPoints(points);
        let line = new Line(geometry, material);

        scene.add(line);
    }


    addBody(planet, center) {
        let geometry, material, sphere;

        let off = offsets[planet.type] / 1000;
        let pos = {
            x: planet.position.x / 1000 + off,
            y: planet.position.y / 1000 + off,
            z: planet.position.z / 1000 + off
        };
        if (planet.offset) {
            pos.x += offset.x;
            pos.y += offset.y;
            pos.z += offset.z;
        }

        let grid = planet.type === "moon" ? 16 : 24;
        let size = planet.radius * 2;
        let color = planet.color ? this.parseHex(planet.color) : 0x99AA33;

        geometry = new SphereBufferGeometry(size, grid, grid);
        material = new MeshLambertMaterial({color: color, wireframe: true});
        sphere = new Mesh(geometry, material);
        sphere.position.set(pos.x, pos.y, pos.z);

        scene.add(sphere);

        sphere.on('mousedown', evt => this.onBodyMouseDown(evt));

        this.addOrbit(center, pos);

        if (planet.moons) {
            let relCenter = {x: pos.x, y: center.y, z: pos.z};
            planet.moons.forEach(moon => this.addBody(moon, relCenter));
        }
    }

    addAsteroids(asteroids) {
        let geometry = new Geometry();
        let material = new PointsMaterial({color: 0x9b9bac2, size: 2.0});

        for (let i in asteroids) {
            let p = new Vector3(asteroids[i].position.x / 1000, asteroids[i].position.y / 1000, asteroids[i].position.z / 1000);
            geometry.vertices.push(p);
            console.log(p);
        }
        let points = new Points(geometry, material);
        scene.add(points);


    }

    addStructure(structure) {
        let geometry = new BufferGeometry();
        let material;

        let pos = new Vector3(structure.position.x , structure.position.y , structure.position.z );
        geometry.position.set(pos.multiplyScalar(0.001));

        switch (structure.size) {
            case 'large':
                material = new PointsMaterial({color: 0xff3636, size: 1.5});
                break;
            default:
                material = new PointsMaterial({color: 0x36ff36, size: 1.5});
        }

        scene.add(new Points(geometry, material));
    }

    addGrids() {
        let gridOptions = [spaceMaxSize * 2.1, 12, 0x707070, 0x303030];
        let gridDistance = spaceMaxSize * 0.7;

        let grid1 = new GridHelper(...gridOptions);
        let grid2 = new GridHelper(spaceMaxSize * 2.1, 20, 0x707070, 0x303030);

        grid1.position.set(0, gridDistance, 0);
        grid2.position.set(0, -gridDistance, 0);

        scene.add(grid1);
        scene.add(grid2);
    }

    render() {
        renderer.render(scene, camera);
    }

    animate() {
        requestAnimationFrame(this.animate);
        controls.update();
        render();
    }
}

export {SpaceMap};