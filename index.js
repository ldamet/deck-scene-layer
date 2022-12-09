import './style.css';
import mapboxgl from 'mapbox-gl';
import { MapboxLayer } from '@deck.gl/mapbox';
import { ScenegraphLayer } from 'deck.gl';
import { Deck } from 'deck.gl';

const AIRPLANE =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/scenegraph-layer/airplane.glb';
const STADIUM =
  'https://raw.githubusercontent.com/ldamet/deck-scene-layer/main/stade_de_france_v2.glb';
// Set your mapbox token here
const MAPBOX_TOKEN = '';
const MODEL = STADIUM;

const INITIAL_VIEW_STATE = {
  latitude: 39.1,
  longitude: -94.57,
  zoom: 16,
  maxZoom: 20,
  pitch: 0,
  bearing: 0,
};

const MAP_STYLE =
  'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

export function renderToDOMMapbox(container) {
  const map = new mapboxgl.Map({
    accessToken: MAPBOX_TOKEN,
    container,
    style: MAP_STYLE,
    center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
    zoom: 16,
  });

  map.addControl(new mapboxgl.NavigationControl(), 'top-left');

  map.on('load', () => {
    const poiLayer = new MapboxLayer({
      type: ScenegraphLayer,
      id: 'scenegraph-layer-mapbox',
      data: [
        {
          name: MODEL,
          position: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
        },
      ],
      sizeScale: 1,
      scenegraph: MODEL,
      getPosition: (d) => d.position,
      getOrientation: (d) => [0, 0, 90],
    });

    map.addLayer(poiLayer);
  });

  return {
    remove: () => {
      map.remove();
    },
  };
}

export function renderToDOMDeck(container) {
  const deckInstance = new Deck({
    initialViewState: INITIAL_VIEW_STATE,
    controller: true,
    canvas: container,
    layers: [
      new ScenegraphLayer({
        id: 'scenegraph-layer-deck',
        data: [
          {
            name: MODEL,
            position: [
              INITIAL_VIEW_STATE.longitude,
              INITIAL_VIEW_STATE.latitude,
            ],
          },
        ],
        sizeScale: 1,
        scenegraph: MODEL,
        getPosition: (d) => d.position,
        getOrientation: (d) => [0, 0, 90],
      }),
    ],
  });
}

export async function loadAndRenderMapbox(container) {
  console.log('Render mapbox', container);
  renderToDOMMapbox(container);
}
export async function loadAndRenderDeck(container) {
  console.log('Render deck', container);
  renderToDOMDeck(container);
}

loadAndRenderMapbox(document.getElementById('mapboxgl'));
loadAndRenderDeck(document.getElementById('deckgl'));
