import * as Cesium from "cesium";


class DrawGeometry {
  private viewer: Cesium.Viewer;
  private pointArr: Cesium.Cartesian3[];

  constructor(viewer) {
    this.viewer = viewer;
    this.pointArr = []
  }

  /**
   * 添加点
   * @param position {Cesium.Cartesian3} 笛卡尔坐标
   * @param color {Cesium.Color} 颜色
   * @param pixelSize {number} 大小
   * @param layer {Cesium.EntityCollection} 添加到的图层
   */
  addPoint(position: Cesium.Cartesian3, color: Cesium.Color = Cesium.Color.DODGERBLUE, pixelSize: number = 8, layer: Cesium.EntityCollection | undefined) {
    this.pointArr.push(position)

    !layer && (layer = this.viewer.entities)

    return layer.add({
      position,
      point: {
        pixelSize,
        color
      }
    })
  }

  addLine(color: Cesium.Color, width, showDistance) {
    if (this.pointArr.length >= 2) {
      let length = Math.ceil(this.getDistance(this.pointArr.slice(-2)))
    }
  }

  getDistance(positions) {
    let distance = 0
    let geodesic = new Cesium.EllipsoidGeodesic()
    for (let i = 0; i < positions.length - 1; i++) {
      const point_one_graphic = Cesium.Cartographic.fromCartesian(positions[i])
      const point_two_graphic = Cesium.Cartographic.fromCartesian(positions[i + 1])

      geodesic.setEndPoints(point_one_graphic, point_two_graphic)
      let s = geodesic.surfaceDistance;

      s = Math.sqrt(Math.pow(s, 2) + Math.pow(point_one_graphic.height - point_two_graphic.height, 2))
      distance += s
    }

    return distance
  }
}

