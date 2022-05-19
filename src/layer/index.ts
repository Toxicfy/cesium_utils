import * as Cesium from 'cesium'
import BaseLayer from './BaseLayer'
import TilesetLayer from './TilesetLayer'
import layerType from './layerType'

class Layer {
  protected viewer: Cesium.Viewer
  private TilesetLayer: object

  constructor (viewer: Cesium.Viewer) {
    this.viewer = viewer
    this.TilesetLayer = TilesetLayer
  }

  addLayer (layer: BaseLayer): BaseLayer {
    switch (layer?.type) {
      case layerType.TILESET_LAYER : { // 加载 tilesetLayer
        (layer as TilesetLayer).readyPromise.then(() => {
          this.viewer.scene.primitives.add(layer._source)
        })
        return layer
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
