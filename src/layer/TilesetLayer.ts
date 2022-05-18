import * as Cesium from 'cesium'
import BaseLayer from './BaseLayer'
import layerType from './layerType'

/**
 * 数据图层 —— 加载 3DTiles
 */
class TilesetLayer extends BaseLayer {
  public _source: Cesium.Cesium3DTileset
  private _style: Cesium.Cesium3DTileStyle

  constructor (url: string, options = {}) {
    super(layerType.TILESET_LAYER)
    this._source = new Cesium.Cesium3DTileset(Object.assign({ url, options }))
  }

  public get style () : Cesium.Cesium3DTileStyle {
    return this._style
  }

  // 设置 3DTile Style
  setStyle (style: Cesium.Cesium3DTileStyle) {
    if (style) {
      this._style = style
      this._source.style = style
    }
  }
}

export default TilesetLayer
