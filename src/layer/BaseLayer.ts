/**
 * 数据图层基类
 */
class BaseLayer {
  protected _layerType: string
  public _source: any // 确定完所有类型的 source 后写成联合类型

  constructor (layerType: string) {
    this._layerType = layerType
  }

  get type () : string {
    return this._layerType
  }

  set type (value: string) {
    this._layerType = value
  }
}

export default BaseLayer
