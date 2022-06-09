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
    const [_x1, _y1, _z1, _x2, _y2, _z2, _x3, _y3, _z3, _x4, _y4, _z4] = this._getCoordinates(rectEntity)
    const resultArr = []
    for (let j = 0; j < count; j++) {
      for (let i = 0; i < count; i++) {
        const hierarchy = []
        // 分割成小面，切分经纬度
        hierarchy.push(new Cesium.Cartesian3(
          _x1 + (_x2 - _x1) / count * i + (_x4 + (_x3 - _x4) / count * (i) - _x1 - (_x2 - _x1) / count * i) / count * j,
          _y1 + (_y2 - _y1) / count * i + (_y4 + (_y3 - _y4) / count * (i) - _y1 - (_y2 - _y1) / count * i) / count * j,
          _z1 + (_z2 - _z1) / count * i + (_z4 + (_z3 - _z4) / count * (i) - _z1 - (_z2 - _z1) / count * i) / count * j)
        )
        hierarchy.push(new Cesium.Cartesian3(
          _x1 + (_x2 - _x1) / count * (i + 1) + (_x4 + (_x3 - _x4) / count * (i + 1) - _x1 - (_x2 - _x1) / count * (i + 1)) / count * j,
          _y1 + (_y2 - _y1) / count * (i + 1) + (_y4 + (_y3 - _y4) / count * (i + 1) - _y1 - (_y2 - _y1) / count * (i + 1)) / count * j,
          _z1 + (_z2 - _z1) / count * (i + 1) + (_z4 + (_z3 - _z4) / count * (i + 1) - _z1 - (_z2 - _z1) / count * (i + 1)) / count * j)
        )
        hierarchy.push(new Cesium.Cartesian3(
          _x4 + (_x3 - _x4) / count * (i + 1) - (_x4 + (_x3 - _x4) / count * (i + 1) - _x1 - (_x2 - _x1) / count * (i + 1)) / count * (count - (j + 1)),
          _y4 + (_y3 - _y4) / count * (i + 1) - (_y4 + (_y3 - _y4) / count * (i + 1) - _y1 - (_y2 - _y1) / count * (i + 1)) / count * (count - (j + 1)),
          _z4 + (_z3 - _z4) / count * (i + 1) - (_z4 + (_z3 - _z4) / count * (i + 1) - _z1 - (_z2 - _z1) / count * (i + 1)) / count * (count - (j + 1)))
        )
        hierarchy.push(new Cesium.Cartesian3(
          _x4 + (_x3 - _x4) / count * i - (_x4 + (_x3 - _x4) / count * (i) - _x1 - (_x2 - _x1) / count * i) / count * (count - (j + 1)),
          _y4 + (_y3 - _y4) / count * i - (_y4 + (_y3 - _y4) / count * (i) - _y1 - (_y2 - _y1) / count * i) / count * (count - (j + 1)),
          _z4 + (_z3 - _z4) / count * i - (_z4 + (_z3 - _z4) / count * (i) - _z1 - (_z2 - _z1) / count * i) / count * (count - (j + 1)))
        )
        // 取出面的8个点坐标，拿点坐标去求高度值
        resultArr.push(Cesium.Cartographic.fromDegrees(hierarchy[0].x, hierarchy[0].y))
        resultArr.push(Cesium.Cartographic.fromDegrees((hierarchy[0].x + hierarchy[1].x) / 2, (hierarchy[0].y + hierarchy[1].y) / 2))
        resultArr.push(Cesium.Cartographic.fromDegrees(hierarchy[1].x, hierarchy[1].y))
        resultArr.push(Cesium.Cartographic.fromDegrees((hierarchy[1].x + hierarchy[2].x) / 2, (hierarchy[1].y + hierarchy[2].y) / 2))
        resultArr.push(Cesium.Cartographic.fromDegrees(hierarchy[2].x, hierarchy[2].y))
        resultArr.push(Cesium.Cartographic.fromDegrees((hierarchy[2].x + hierarchy[3].x) / 2, (hierarchy[2].y + hierarchy[3].y) / 2))
        resultArr.push(Cesium.Cartographic.fromDegrees(hierarchy[3].x, hierarchy[3].y))
        resultArr.push(Cesium.Cartographic.fromDegrees((hierarchy[3].x + hierarchy[0].x) / 2, (hierarchy[3].y + hierarchy[0].y) / 2))
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
        const result = Math.atan(h / s) * 180 / Math.PI
        return isNaN(result) ? 0 : result
      }
      // 不同的坡度展示的颜色配置
      let slopeColor = ''

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
        const instance = (this._createRectAngleInstance([
          Cesium.Math.toDegrees(positions[m].longitude),
          Cesium.Math.toDegrees(positions[m].latitude),
          Cesium.Math.toDegrees(positions[m + 4].longitude),
          Cesium.Math.toDegrees(positions[m + 4].latitude)
        ], slopeColor))

        this._slopePrimitives.add(new Cesium.GroundPrimitive({
          geometryInstances: instance,
          appearance: new Cesium.PerInstanceColorAppearance()
        }))

        // 绘制箭头 primitive 表示坡向方向;
        const linePrimitive = this._createPolylinePrimitive(arrowLinePositions)
        this._slopePrimitives.add(linePrimitive)
        m += 8
      }

      this._isFinishComputed = true
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

    return [west, south, 0, east, south, 0, east, north, 0, west, north, 0]
  }

  _createRectAngleInstance (position: number[], color: string) {
    console.log(color, 'color')

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
