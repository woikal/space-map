import {SpaceMap} from "./SpaceMap.js";

function main(data) {
    const container = document.body;
    const map = new SpaceMap(container, data.config, data);
    map.start();
}

// fetch('../data/objects_data.json')
//     .then(respond => respond.text())
//     .then(data => main(JSON.parse(data)));

// fetch-Aufruf mit Pfad zur XML-Datei
fetch('../data/SANDBOX_0_0_0_.sbs')
    .then(response => response.text())
    .then(data => {
        const parser = new DOMParser(),
            xmlDoc = parser.parseFromString(data, 'text/xml');
        const builder = xmlDoc.getElementsByTagName('SectorObjects')[0].children;
        const obj = filterXmlMap(builder);
        console.log(obj);
        console.log(JSON.stringify(obj));
        // console.log("item " + xmlDoc.getElementsByTagName('item')[1].children[0].textContent);
    })
    .catch(ex => console.log(ex));

function filterXmlMap(builders) {
    const obj = {satellites: [], asteroids: [], structures: [], safezones: []};
    for (let b of builders) {
        switch (b.attributes[0].nodeValue) {
            case 'MyObjectBuilder_CubeGrid':
                obj.structures.push(b);
                break;
            case 'MyObjectBuilder_Planet':
                obj.satellites.push(b);
                break;
            case 'MyObjectBuilder_VoxelMap':
                obj.asteroids.push(filterXmlAsteroid(b.children));
                break;
            case 'MyObjectBuilder_SafeZone':
                obj.safezones.push(b);
                break;
            default:
                console.log(b.attributes);
        }
    }
    return obj;
}

function filterXmlAsteroid(xml) {
    const obj = {id: 0, position: {}};
    for (let node of xml) {
        switch (node.localName) {
            case 'EntityId':
                obj.id = node.nodeValue;
                break;
            case 'PositionAndOrientation':
                obj.position = getXmlPosition(node.children);
                break;
        }
    }
    return obj;
}

function getXmlPosition(node) {
    if (node.has('Position'))
        console.log(node);
    return {x: 0, y: 0, z: 0};
}

