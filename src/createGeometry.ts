import * as Cesium from 'cesium'

export default class CreateGeometry {
  private viewer: Cesium.Viewer
  private pointArr: Cesium.Cartesian3[]

  constructor (viewer: Cesium.Viewer) {
    this.viewer = viewer
    this.pointArr = []
  }

  /**
   * 添加点
   * @param position 坐标信息
   * @param color 颜色
   * @param pixelSize 大小
   * @param layer 添加到的图层
   * @returns 点对象
   */
  addPoint (position: Cesium.Cartesian3, color = Cesium.Color.DODGERBLUE, pixelSize = 8, layer = this.viewer.entities) {
    this.pointArr.push(position)

    return layer.add({
      position,
      point: {
        pixelSize,
        color
      }
    })
  }

  /**
   * 添加线段
   * @param color 线的颜色
   * @param width 线的宽度
   * @param showDistance 是否展示距离
   * @param layer 添加到的图层
   * @return {Cesium.Entity[]} 添加的entities —— (lineEntity) 及 (labelEntity | null)
   */
  addLine (color: Cesium.Color = Cesium.Color.DODGERBLUE, width: number = 2, showDistance: boolean, layer: Cesium.EntityCollection = this.viewer.entities): Cesium.Entity[] {
    const length = this.pointArr.length
    let lineLength: number
    if (length >= 2) {
      lineLength = Math.ceil(this.getDistance(this.pointArr.slice(-2)))
    }

    const lastPosition = this.pointArr[length - 2]
    const currentPosition = this.pointArr[length - 1]

    const line = layer.add({
      name: 'line',
      polyline: {
        positions: [lastPosition, currentPosition],
        width,
        material: color
      }
    })
    // @ts-ignore 给 line 加一个 _length 进行访问
    line._length = lineLength

    let label: Cesium.Entity | null
    if (showDistance) {
      label = layer.add({
        // 取线段的中点
        position: Cesium.Cartesian3.fromElements(
          lastPosition.x + (currentPosition.x - lastPosition.x) / 2,
          lastPosition.y + (currentPosition.y - lastPosition.y) / 2,
          lastPosition.z + (currentPosition.z - lastPosition.z) / 2
        ),
        label: {
          text: `${lineLength}米`,
          showBackground: true,
          backgroundColor: Cesium.Color.BLACK.withAlpha(0.5),
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -9),
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
      })
    }

    return [line, label]
  }

  /**
   * 计算点之间的空间距离
   * @param positions 点的集合
   * @returns 距离值
   */
  getDistance (positions: Cesium.Cartesian3[]): number {
    let distance = 0

    // 测地线，空间中两个位置的 “最短距离”
    const geodesic = new Cesium.EllipsoidGeodesic()

    for (let i = 0; i < positions.length - 1; i++) {
      const pointOneGraphic = Cesium.Cartographic.fromCartesian(positions[i])
      const pointTwoGraphic = Cesium.Cartographic.fromCartesian(positions[i + 1])

      geodesic.setEndPoints(pointOneGraphic, pointTwoGraphic)
      let s = geodesic.surfaceDistance

      // 三角形求斜边
      s = Math.sqrt(Math.pow(s, 2) + Math.pow(pointOneGraphic.height - pointTwoGraphic.height, 2))
      distance += s
    }

    return distance
  }
}
