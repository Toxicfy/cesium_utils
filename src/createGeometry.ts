import * as Cesium from 'cesium'

interface IPointOptions {
  position: Cesium.Cartesian3
  color?: Cesium.Color
  pixelSize?: number
  layer?: Cesium.EntityCollection
}

interface ILineOptions {
  positions: Cesium.Cartesian3[] | Cesium.CallbackProperty
  color?: Cesium.Color
  width?: number
  showDistance?: boolean
  layer?: Cesium.EntityCollection
}

interface IRectAngleOptions {
  positions: Cesium.Cartesian3[] | Cesium.CallbackProperty
  layer?: Cesium.EntityCollection
}

export default class CreateGeometry {
  private viewer: Cesium.Viewer
  private readonly pointArr: Cesium.Cartesian3[]

  constructor (viewer: Cesium.Viewer) {
    this.viewer = viewer
    this.pointArr = []
  }

  _getPositionValue (positions: Cesium.Cartesian3[] | Cesium.CallbackProperty) {
    if (positions instanceof Array) {
      return positions
    } else {
      return positions.getValue(new Cesium.JulianDate())
    }
  }

  addPoint (options: IPointOptions): Cesium.Entity {
    const { position, color = Cesium.Color.DODGERBLUE, pixelSize = 10, layer = this.viewer.entities } = options
    this.pointArr.push(position)

    return layer.add({
      position,
      point: {
        pixelSize,
        color
      }
    })
  }

  addLine (lineOptions: ILineOptions): Cesium.Entity|Cesium.Entity[] {
    const { positions, color = Cesium.Color.DODGERBLUE, width = 5, showDistance = false, layer = this.viewer.entities } = lineOptions
    const lineEntity = layer.add({
      polyline: {
        positions,
        width,
        material: color
      }
    })

    if (!showDistance) return lineEntity // 不展示长度信息，直接返回

    // 循环计算每段线段长度
    const result = []
    result.push(lineEntity)
    const positionArr = this._getPositionValue(positions)
    for (let i = 0; i < positionArr.length - 1; i++) {
      const distance = this.getDistance(positions[i], positions[i + 1])
      const labelEntity = layer.add({
        position: Cesium.Cartesian3.midpoint(positions[i], positions[i + 1], new Cesium.Cartesian3()),
        label: {
          text: `${distance.toFixed(2)}米`,
          showBackground: true,
          backgroundColor: Cesium.Color.BLACK.withAlpha(0.5),
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -9),
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
      })
      result.push(labelEntity)
    }

    return result
  }

  addRectAngle (rectangleOption: IRectAngleOptions): Cesium.Entity {
    const { positions, layer = this.viewer.entities } = rectangleOption

    let positionArr: Cesium.Cartesian3[]
    if (positions instanceof Array) {
      positionArr = positions
    } else {
      positionArr = positions.getValue(new Cesium.JulianDate())
    }

    return layer.add({
      name: 'rectangle',
      rectangle: {
        coordinates: new Cesium.CallbackProperty(() => {
          return Cesium.Rectangle.fromCartesianArray(positionArr)
        }, false),
        material: Cesium.Color.DODGERBLUE.withAlpha(0.5)
      }
    })
  }

  // 计算点之间的空间距离
  getDistance (first, last): number {
    // 测地线，空间中两个位置的 “最短距离”
    const geodesic = new Cesium.EllipsoidGeodesic()
    const pointOneGraphic = Cesium.Cartographic.fromCartesian(first)
    const pointTwoGraphic = Cesium.Cartographic.fromCartesian(last)

    geodesic.setEndPoints(pointOneGraphic, pointTwoGraphic)
    const s = geodesic.surfaceDistance

    // 三角形求斜边
    return Math.sqrt(Math.pow(s, 2) + Math.pow(pointOneGraphic.height - pointTwoGraphic.height, 2))
  }
}
