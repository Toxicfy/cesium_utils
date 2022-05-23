import { defaultViewerOptions } from './config'
import * as Cesium from 'cesium'
import CreateGeometry from './createGeometry'
import Layer from './layer/index'

import ToolTip from './ToolTips'
import './assets/common.css'

/**
 * Main Entry
 */
class Map extends Cesium.Viewer {
  createGeometry: CreateGeometry
  layer: Layer
  toolTip: ToolTip
  earth: any

  constructor (container = 'map-container', options: Cesium.Viewer.ConstructorOptions = {}) {
    super(container, Object.assign({}, defaultViewerOptions, options))
    // 初始化 viewer 的一些配置项
    this._initViewer()
    this.earth = Cesium
  }

  private _initViewer () {
    (this as any)._cesiumWidget._creditContainer.style.display = 'none' // 隐藏cesium's logo
    this._initCustomProperty()
  }

  // 初始化各种属性方法
  _initCustomProperty () {
    this.createGeometry = new CreateGeometry(this) // geometry entity 方法集合
    this.layer = new Layer(this)
    this.toolTip = new ToolTip()
  }

  // 获取资源目录地址
  public get baseUrl () : string {
    return window.CESIUM_BASE_URL
  }

  // 设置资源目录地址
  static setBaseUrl (v : string) {
    window.CESIUM_BASE_URL = v
  }
}

export default Map
