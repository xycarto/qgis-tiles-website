import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import {get as getProjection} from 'ol/proj';
import {fromLonLat} from 'ol/proj';
import XYZ from 'ol/source/XYZ.js';
import TileGrid from 'ol/tilegrid/TileGrid.js';
import {Group} from 'ol/layer';

const MAXZOOM = 9

// set NZTM projection
proj4.defs("EPSG:2193","+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
register(proj4);
const nztmProjection = getProjection('EPSG:2193');
var origin = [-1000000, 10000000];
var resolutions = [ 8960.0, 4480.0, 2240.0, 1120.0, 560, 280, 140, 70, 28, 14, 7, 2.8];
const matrixIds = [0, 1, 2];

const xyzUrlColour = "https://qgis-tiles.s3.amazonaws.com/tiles/full-nz-colour/v1/full-nz-colour/{z}/{x}/{y}.png"
const xyzUrlMono = "https://qgis-tiles.s3.amazonaws.com/tiles/full-nz-mono/v1/full-nz-mono/{z}/{x}/{y}.png"

const mono = new TileLayer({
  title: 'monochrome',
  crossOrigin: 'anonymous',
  source: new XYZ({
    url: xyzUrlMono,
    wrapX: true,
    projection: nztmProjection,
    tileGrid: new TileGrid({
      origin: origin,
      resolutions: resolutions,
      tileSize: [256, 256],
    })
  })
});

const colour = new TileLayer({
  title: 'colour',
  crossOrigin: 'anonymous',
  source: new XYZ({
    url: xyzUrlColour,
    wrapX: true,
    projection: nztmProjection,
    tileGrid: new TileGrid({
      origin: origin,
      resolutions: resolutions,
      tileSize: [256, 256],
    })
  })
});

const baseGroup = new Group({
  layers: [
    mono,
    colour
  ]
})

// Draw map
const map = new Map ({
  layers: [baseGroup],
  target: 'map',
  pixelRatio: 2,
  view: new View({
    projection: nztmProjection,
    center: fromLonLat([177.0,-39.5], nztmProjection),
    zoom: 1,
    minResolution: 2.8,
    maxResolution: 2240.0,
    constrainResolution: true,
    enableRotation: false,
  })
});

// Layer Switcher
const baseElements = document.querySelectorAll('.sidebar > input[type=radio]')
for(let baseElement of baseElements){
  baseElement.addEventListener('change', function(){
    let baseValue = this.value;
    baseGroup.getLayers().forEach(function(element, index, array){
      let baseTitle = element.get('title');
      element.setVisible(baseTitle === baseValue);
    })
  })
}
