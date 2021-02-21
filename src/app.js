import {SpaceMap} from "./SpaceMap.js";

function main(data) {
    const container = document.body;
    const map = new SpaceMap(container, data.config, data);
    map.start();
}

fetch('../data/objects_data.json')
    .then(respond => respond.text())
    .then(data => main(JSON.parse(data)));