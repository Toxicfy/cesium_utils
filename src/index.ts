import { defaultViewerOptions } from './config/config'
import * as Cesium from 'cesium'
import CreateGeometry from './createGeometry'

/**
 * Main Entry
 */
class Map extends Cesium.Viewer {
  createGeometry: CreateGeometry
  constructor (container = 'map-container', options: Cesium.Viewer.ConstructorOptions = {}) {
    super(container, Object.assign({}, defaultViewerOptions, options))
    // 初始化 viewer 的一些配置项
    this._initViewer()
  }

  private _initViewer () {
    (this as any)._cesiumWidget._creditContainer.style.display = 'none' // 隐藏cesium's logo
    this._initCreateGeometry()
  }

  _initCreateGeometry () {
    this.createGeometry = new CreateGeometry(this)
  }

  public get baseUrl () : string {
    return window.CESIUM_BASE_URL
  }

  static setBaseUrl (v : string) {
    window.CESIUM_BASE_URL = v
  }
}

export default Map
