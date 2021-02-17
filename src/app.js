import {SpaceMap} from "./SpaceMap.js";

function main(data) {
    console.log(data);
    const container = document.querySelector('#scene-container');
    const world = new SpaceMap(container, data.config, data);
    world.render();
    world.animate();
}

function readDataFile(evt) {
    console.log(evt);

    let file = evt.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        main(JSON.parse(e.target.result));
    };
    return reader.readAsText(file);
}

let input = document.querySelector('#input-file');
console.log(input);
if (input) input.addEventListener('change', readDataFile, false);
