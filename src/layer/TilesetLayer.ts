import * as Cesium from 'cesium'
import BaseLayer from './BaseLayer'

class TilesetLayer extends BaseLayer {
  public _source: Cesium.Cesium3DTileset

  constructor (url: string, options = {}) {
    super('TilesetLayer')
    this._source = new Cesium.Cesium3DTileset(Object.assign({ url, options }))
  }
}

export default TilesetLayer
