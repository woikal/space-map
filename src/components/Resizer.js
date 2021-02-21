const setSize = (container, camera, renderer) => {
    camera.aspect = 16 / 9;
    // camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientWidth * 9 / 16);
    renderer.setPixelRatio(window.devicePixelRatio);
};

class Resizer {
    constructor(container, camera, renderer) {
        this.container = container;
        this.camera = camera;
        this.renderer = renderer;
        // set initial size on load
        setSize(container, camera, renderer);

        window.addEventListener('resize', () => {
            setSize(this.container, this.camera, this.renderer);
            this.onResize();
        });
    }

    onResize() {/* visitor */}
}

export {Resizer};