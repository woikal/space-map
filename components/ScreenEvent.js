import {Raycaster, Vector2} from "three";


class ScreenEvent {
    constructor(camera, scene, canvas) {
        this.camera = camera;
        this.scene = scene;
        this.canvas= canvas;

        this.mouse = new Vector2();
        this.raycaster = new Raycaster();
        this.mouseLocked = false;

        document.addEventListener('mousemove', ev => this.onDocumentMouseMove(ev));
        document.addEventListener('mousedown', ev => this.onDocumentMouseDown(ev));
        document.addEventListener('mouseup', ev => this.onDocumentMouseUp(ev));
    }

    onDocumentMouseMove(event) {
        event.preventDefault();
        this.mouse.set(2 * event.clientX / this.canvas.width - 1, -2 * event.clientY / this.canvas.height + 1);

        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.intersects = this.raycaster.intersectObjects(this.scene.children);
    }

    onDocumentMouseDown(event) {
        console.log('down');
        console.log(this.mouse);
        if (this.mouseLocked) return;

        event.preventDefault();

        if (this.intersects.length > 0) {
            let INTERSECTED = this.intersects[0].object;
            console.log(INTERSECTED.geometry);

        } else {
            console.log('locked')
        }
    }

    onDocumentMouseUp(event) {
        this.mouseLocked = false;
    }
}

export {ScreenEvent};