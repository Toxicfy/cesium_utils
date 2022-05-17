import * as Cesium from 'cesium'
import BaseLayer from './BaseLayer'
import layerType from './LayerType'

/**
 * 数据图层 —— 加载 wms 瓦片
 */
class WmsLayer extends BaseLayer {
  private readonly _defaultOptions: {}
  constructor (options: Cesium.WebMapServiceImageryProvider.ConstructorOptions) {
    super(layerType.WMS_LAYER)

    this._defaultOptions = {
      params: {
        format: 'image/png',
        srs: 'EPSG:4326',
        transparent: true
      }
    }

    this._source = new Cesium.WebMapServiceImageryProvider(Object.assign({}, this._defaultOptions, options))
  }
}

export default WmsLayer
