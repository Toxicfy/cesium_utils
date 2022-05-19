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
    this._source = new Cesium.Cesium3DTileset(Object.assign({ url }, options))
  }

  public get style () : Cesium.Cesium3DTileStyle {
    return this._style
  }

  public get readyPromise ():Promise<Cesium.Cesium3DTileset> {
    return this._source.readyPromise
  }

  // 设置 3DTile Style
  setStyle (style: Cesium.Cesium3DTileStyle) {
    if (style) {
      this._style = style
      this._source.style = style
    }
  }

  // 数据贴地处理
  clampToGround () {
    this.readyPromise.then(tileset => {
      const { longitude, latitude, height } = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center)

      const surface = Cesium.Cartesian3.fromRadians(longitude, latitude, height)
      const offset = Cesium.Cartesian3.fromRadians(longitude, latitude, 0)

      const transition = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3())
      tileset.modelMatrix = Cesium.Matrix4.fromTranslation(transition)
    })

    return this
  }
}

export default TilesetLayer
