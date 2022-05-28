import * as Cesium from 'cesium'
import './assets/common.css'
import CreateGeometry from './createGeometry'
import Layer from './layer/index'
import ToolTip from './ToolTips'
import Analysis from './analysis'
import Tool from './tool'
import { defaultViewerOptions } from './config'

/**
 * Main Entry
 */
class Map extends Cesium.Viewer {
  createGeometry: CreateGeometry
  layer: Layer
  toolTip: ToolTip
  tool: Tool
  analysis: Analysis
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
    this.analysis = new Analysis(this)
    this.tool = new Tool(this)
  }

  // 通过视口坐标获取三维坐标 (已有直接拾取到坐标 + entity + primitive)，TODO：需要添加 Cesium3DTileset 与 Cesium3DTileFeature
  _pickPositionByWindowPosition (position): Cesium.Cartesian3 {
    const result = this.scene.pick(position) || this.camera.pickEllipsoid(position)

    if (result instanceof Cesium.Cartesian3) {
      return result
    }

    if (result?.id instanceof Cesium.Entity) {
      return result.id.position.getValue(new Cesium.JulianDate())
    }

    if (result?.primitive) {
      return result.primitive.position
    }
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
