import { sourceType } from './layer'
/**
 * 数据图层基类
 */
class BaseLayer {
  protected _layerType: string
  public _source: sourceType // 确定完所有类型的 source 后写成联合类型

  constructor (layerType: string) {
    this._layerType = layerType
  }

  get type () : string {
    return this._layerType
  }

  get source () : sourceType {
    return this._source
  }
}

export default BaseLayer
