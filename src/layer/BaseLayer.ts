import * as Cesium from 'cesium'
/**
 * 数据图层基类
 */
class BaseLayer {
  protected _layerType: string
  public _source: Cesium.Cesium3DTileset|Cesium.ImageryProvider // 确定完所有类型的 source 后写成联合类型

  constructor (layerType: string) {
    this._layerType = layerType
  }

  get type () : string {
    return this._layerType
  }
}

export default BaseLayer
