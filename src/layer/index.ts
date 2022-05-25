import * as Cesium from 'cesium'
import BaseLayer from './BaseLayer'
import TilesetLayer from './TilesetLayer'
import WmsLayer from './WmsLayer'
import layerType from './layerType'
import { sourceType } from './layer'

class Layer {
  protected viewer: Cesium.Viewer

  constructor (viewer: Cesium.Viewer) {
    this.viewer = viewer
  }

  get TileSetLayer () {
    return TilesetLayer
  }

  get WmsLayer () {
    return WmsLayer
  }

  addLayer (layer: BaseLayer): sourceType {
    switch (layer?.type) {
      case layerType.TILESET_LAYER : { // 加载 tilesetLayer
        (layer as TilesetLayer).readyPromise.then(() => {
          this.viewer.scene.primitives.add(layer._source)
        })
        return layer._source
      }

      default :
        break
    }
  }

  removeLayer (layer: BaseLayer): boolean {
    switch (layer?.type) {
      case layerType.TILESET_LAYER : {
        return this.viewer.scene.primitives.remove(layer._source)
      }

      default :
        break
    }
  }
}

export default Layer
