import * as Cesium from 'cesium'
import BaseLayer from './BaseLayer'
import TilesetLayer from './TilesetLayer'
import layerType from './layerType'

class Layer {
  protected viewer: Cesium.Viewer
  private TilesetLayer = TilesetLayer

  constructor (viewer: Cesium.Viewer) {
    this.viewer = viewer
  }

  addLayer (layer: BaseLayer): object {
    switch (layer?.type) {
      case layerType.TILESET_LAYER : { // 加载 tilesetLayer
        return this.viewer.scene.primitives.add(layer._source)
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
