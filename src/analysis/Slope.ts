import * as Cesium from 'cesium'
import Map from '../index'
import BaseAnalysis from './BaseAnalysis'

// PS：坡度坡向功能中不混入 drawTool 的部分，而是直接接受对应的坐标参数
class Slope extends BaseAnalysis {
  private readonly handler: Cesium.ScreenSpaceEventHandler
  private splitCount: number
  private readonly _slopeDisplayData: Array<{ color: string; count: number; range: number[] }>
  private readonly _slopePrimitives: Cesium.PrimitiveCollection
  private _isFinishComputed: boolean

  constructor () {
    super()
    this.handler = null
    this.splitCount = 20

    this._slopePrimitives = new Cesium.PrimitiveCollection()

    // 坡度值范围对应的颜色及数量
    this._slopeDisplayData = [
      { range: [0, 5], color: '#00ff00', count: 0 },
      { range: [5, 15], color: '#ffff00', count: 0 },
      { range: [15, 25], color: '#ffa500', count: 0 },
      { range: [25, 35], color: '#0000ff', count: 0 },
      { range: [35, 45], color: '#800080', count: 0 },
      { range: [45, 90], color: '#ff0000', count: 0 }
    ]
    this._isFinishComputed = false // 是否已经完成计算坡度值计算
  }

  get slopeDisplayData () {
    return this._isFinishComputed ? this._slopeDisplayData : this._createErrorMessage('尚未计算完成')
  }

  _createErrorMessage (errorMessage: string) {
    return `Error: ${errorMessage}`
  }

  init (viewer: Map) {
    if (!viewer) return this._createErrorMessage('viewer is required')
    if (!viewer.terrainProvider.availability) return this._createErrorMessage('terrainProvider is availability')
    // 添加 primitiveCollection用于展示
    this.viewer.scene.primitives.add(this._slopePrimitives)
  }

  start (rectEntity: Cesium.Entity) {
    const resultArr = this._splitRectArea(rectEntity)
    this._computeSlopeAngle(resultArr)
  }

  // 矩形区域划分为 count * count 个小区域
  _splitRectArea (rectEntity: Cesium.Entity, count = this.splitCount) {
    this._isFinishComputed = false

    const [x1, y1, x2, y2, x3, y3, x4, y4] = this._getCoordinates(rectEntity)
    const resultArr = []
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        const xLength1 = (x2 - x1) / count
        const xLength2 = (x3 - x4) / count
        const yLength1 = (y2 - y1) / count
        const yLength2 = (y3 - y4) / count
        // point_1
        const _x1 = x1 + xLength1 * i + (x4 + xLength2 * i - x1 - xLength1 * i) / count * j
        const _y1 = y1 + yLength1 * i + (y4 + yLength2 * i - y1 - yLength1 * i) / count * j
        // point_2
        const _x2 = x1 + xLength1 * (i + 1) + (x4 + xLength2 * (i + 1) - x1 - xLength1 * (i + 1)) / count * j
        const _y2 = y1 + yLength1 * (i + 1) + (y4 + yLength2 * (i + 1) - y1 - yLength1 * (i + 1)) / count * j
        // point_3
        const _x3 = x4 + xLength2 * (i + 1) - (x4 + xLength2 * (i + 1) - x1 - xLength1 * (i + 1)) / count * (count - (j + 1))
        const _y3 = y4 + yLength2 * (i + 1) - (y4 + yLength2 * (i + 1) - y1 - yLength1 * (i + 1)) / count * (count - (j + 1))
        // point_4
        const _x4 = x4 + xLength2 * i - (x4 + xLength2 * i - x1 - xLength1 * i) / count * (count - (j + 1))
        const _y4 = y4 + yLength2 * i - (y4 + yLength2 * i - y1 - yLength1 * i) / count * (count - (j + 1))

        resultArr.push(
          Cesium.Cartographic.fromDegrees(_x1, _y1, 0),
          Cesium.Cartographic.fromDegrees(_x2, _y2, 0),
          Cesium.Cartographic.fromDegrees(_x3, _y3, 0),
          Cesium.Cartographic.fromDegrees(_x4, _y4, 0)
        )
      }
    }
    return resultArr
  }

  // 计算坡度值
  _computeSlopeAngle (linePositions: Cesium.Cartographic[]) {
    // 通过地形的高度更新集合
    Cesium.sampleTerrainMostDetailed(this.viewer.terrainProvider, linePositions).then(positions => {
      let m = 0
      // 计算两点之间的坡度度数
      const _calcSlope = (pos1: Cesium.Cartographic, pos2: Cesium.Cartographic) => {
        const h = pos1.height - pos2.height
        const s = Cesium.Cartesian3.distance(
          Cesium.Cartesian3.fromDegrees(pos1.latitude, pos1.latitude, pos1.height),
          Cesium.Cartesian3.fromDegrees(pos2.latitude, pos2.latitude, pos2.height)
        )
        return Math.asin(h / s) * 180 / Math.PI
      }
      // 不同的坡度展示的颜色配置
      let slopeColor = ''
      const rectAnglePrimitiveCollection = []

      for (let k = 0; k < positions.length / 8; k++) {
        const slope1 = _calcSlope(positions[m], positions[m + 4])
        const slope2 = _calcSlope(positions[m + 1], positions[m + 5])
        const slope3 = _calcSlope(positions[m + 2], positions[m + 6])
        const slope4 = _calcSlope(positions[m + 3], positions[m + 7])
        // 获取坡度绝对值的最大值
        const slopeAbsArr = [slope1, slope2, slope3, slope4].map(Math.abs)
        const slope = Math.max(...slopeAbsArr)
        // 添加坡向线的坐标
        const index = slopeAbsArr.indexOf(slope)
        const arrowLinePositions = []
        if ([slope1, slope2, slope3, slope4][index] > 0) {
          arrowLinePositions.push(
            Cesium.Math.toDegrees(positions[m + index].longitude),
            Cesium.Math.toDegrees(positions[m + index].latitude),
            Cesium.Math.toDegrees(positions[m + index + 4].longitude),
            Cesium.Math.toDegrees(positions[m + index + 4].latitude)
          )
        } else {
          arrowLinePositions.push(
            Cesium.Math.toDegrees(positions[m + index + 4].longitude),
            Cesium.Math.toDegrees(positions[m + index + 4].latitude),
            Cesium.Math.toDegrees(positions[m + index].longitude),
            Cesium.Math.toDegrees(positions[m + index].latitude)
          )
        }
        // 判断 slope 的范围区间并设置颜色及统计该范围的个数
        for (let i = 0; i < this._slopeDisplayData.length; i++) {
          if (slope >= this._slopeDisplayData[i].range[0] && slope < this._slopeDisplayData[i].range[1]) {
            slopeColor = this._slopeDisplayData[i].color
            this._slopeDisplayData[i].count++
            break
          }
        }
        // 依据slopeColor，绘制矩形 primitive 表面坡度
        rectAnglePrimitiveCollection.push(this._createRectAnglePrimitive([
          Cesium.Math.toDegrees(positions[m].longitude),
          Cesium.Math.toDegrees(positions[m].latitude),
          Cesium.Math.toDegrees(positions[m + 4].longitude),
          Cesium.Math.toDegrees(positions[m + 4].latitude)
        ], slopeColor))
        // 绘制箭头 primitive 表示坡向方向;
        const linePrimitive = this._createPolylinePrimitive(arrowLinePositions)
        this._slopePrimitives.add(linePrimitive)
        m += 8
      }

      this._isFinishComputed = true
      this._slopePrimitives.add(new Cesium.GroundPrimitive({
        geometryInstances: rectAnglePrimitiveCollection,
        appearance: new Cesium.PerInstanceColorAppearance({})
      }))
      console.log(this._slopePrimitives)
      // TODO: removeAll drawTool Area
    })
  }

  // 获取坐标点
  _getCoordinates (rectEntity) {
    const coordinates = rectEntity.rectangle.coordinates.getValue(new Cesium.JulianDate())
    // 转换成角度
    const west = Cesium.Math.toDegrees(coordinates.west)
    const east = Cesium.Math.toDegrees(coordinates.east)
    const south = Cesium.Math.toDegrees(coordinates.south)
    const north = Cesium.Math.toDegrees(coordinates.north)

    return [west, south, east, south, east, north, west, north]
  }

  _createRectAnglePrimitive (position: number[], color: string) {
    return new Cesium.GeometryInstance({
      geometry: new Cesium.RectangleGeometry({
        rectangle: Cesium.Rectangle.fromDegrees(
          position[0],
          position[1],
          position[2],
          position[3]
        ),
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
      }),
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString(color))
      }
    })
  }

  _createPolylinePrimitive (positions: any[]) {
    return new Cesium.GroundPolylinePrimitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.GroundPolylineGeometry({
          positions: Cesium.Cartesian3.fromDegreesArray(positions),
          width: 10
        }),
        attributes: {
          // 可见范围
          distanceDisplayCondition: new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(0, 4000)
        }
      }),
      appearance: new Cesium.PolylineMaterialAppearance({
        // 箭头样式
        material: Cesium.Material.fromType(Cesium.Material.PolylineArrowType)
      })
    })
  }

  destroy () {
    if (this.handler && !this.handler.isDestroyed()) {
      this.handler.destroy()
    }
    if (this._slopePrimitives) {
      this._slopePrimitives.removeAll()
      this.viewer.scene.primitives.remove(this._slopePrimitives)
    }
  }
}

export default Slope
