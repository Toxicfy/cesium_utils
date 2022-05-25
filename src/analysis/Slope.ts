import * as Cesium from 'cesium'
import BaseAnalysis from './BaseAnalysis'

class Slope extends BaseAnalysis {
  private _handler: Cesium.ScreenSpaceEventHandler

  constructor () {
    super()
    this._handler = null
  }

  _canAnalysis (terrainProvider: Cesium.TerrainProvider): boolean {
    return !!terrainProvider.availability
  }

  init (viewer: Cesium.Viewer) {
    if (!viewer) return 'Error: 无法初始化，缺少场景'
  }
}

export default Slope
