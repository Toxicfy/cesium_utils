import * as Cesium from 'cesium'
import CreateGeometry from './createGeometry'

class Map extends Cesium.Viewer {
  createGeometry: CreateGeometry
  constructor (container = 'map-container', options: Cesium.Viewer.ConstructorOptions = {}) {
    super(container, options)
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
