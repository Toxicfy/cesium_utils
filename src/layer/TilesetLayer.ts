import * as Cesium from 'cesium'
import BaseLayer from './BaseLayer'
import layerType from './layerType'

/**
 * 数据图层 —— 加载 3DTiles
 */
class TilesetLayer extends BaseLayer {
  public _source: Cesium.Cesium3DTileset

  constructor (url: string, options = {}) {
    super(layerType.TILESET_LAYER)
    this._source = new Cesium.Cesium3DTileset(Object.assign({ url, options }))
  }
}

export default TilesetLayer
