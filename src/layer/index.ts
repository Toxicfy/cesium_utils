import * as Cesium from 'cesium'
import BaseLayer from './BaseLayer'
import TilesetLayer from './TilesetLayer'
class Layer {
  protected viewer: Cesium.Viewer
  private TilesetLayer = TilesetLayer

  constructor (viewer: Cesium.Viewer) {
    this.viewer = viewer
  }

  addLayer (layer: BaseLayer): object {
    switch (layer?.type) {
      case 'TilesetLayer' : { // 加载 tilesetLayer
        return this.viewer.scene.primitives.add(layer._source)
      }

      default :
        break
    }
  }

  removeLayer (layer: BaseLayer): boolean {
    switch (layer?.type) {
      case 'TilesetLayer' : {
        return this.viewer.scene.primitives.remove(layer._source)
      }

      default :
        break
    }
  }
}

export default Layer
