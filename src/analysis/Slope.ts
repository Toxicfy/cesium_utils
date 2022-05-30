import * as Cesium from 'cesium'
import Map from '../index'
import BaseAnalysis from './BaseAnalysis'

// PS：坡度坡向功能中不混入 drawTool 的部分，而是直接接受对应的坐标参数
class Slope extends BaseAnalysis {
  private handler: Cesium.ScreenSpaceEventHandler
  private drawTool

  constructor () {
    super()
    this.handler = null
    this.drawTool = null
  }

  _createErrorMessage (errorMessage: string) {
    return `Error: ${errorMessage}`
  }

  init (viewer: Map) {
    if (!viewer) return this._createErrorMessage('viewer is required')
    if (!viewer.terrainProvider.availability) return this._createErrorMessage('terrainProvider is availability')
  }

  // 矩形区域划分为 count * count 个小区域
  _splitRectArea (rectEntity: Cesium.Entity, count = 50) {
    const [x1, y1, x2, y2, x3, y3, x4, y4] = this._getCoordinates(rectEntity)
    const resultArr = []
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        const xLength1 = (x2 - x1) / count * i
        const xLength2 = (x3 - x4) / count * i
        const yLength1 = (y2 - y1) / count * j
        const yLength2 = (y3 - y4) / count * j
        const _x = x1 + xLength1 * i + (x4 + xLength2 - x1 - xLength1) / count * j
        const _y = y1 + yLength1 * i + (y4 + yLength2 - y1 - yLength1) / count * j
        resultArr.push(new Cesium.Cartesian3(_x, _y, 0))
      }
    }
  }

  _getCoordinates (rectEntity) {
    const coordinates = rectEntity.rectangle.coordinates.getValue(new Cesium.JulianDate())
    // 转换成角度
    const west = Cesium.Math.toDegrees(coordinates.west)
    const east = Cesium.Math.toDegrees(coordinates.east)
    const south = Cesium.Math.toDegrees(coordinates.south)
    const north = Cesium.Math.toDegrees(coordinates.north)

    return [west, south, east, south, east, north, west, north]
  }

  destroy () {
    if (this.handler && !this.handler.isDestroyed()) {
      this.handler.destroy()
    }
  }
}

export default Slope
