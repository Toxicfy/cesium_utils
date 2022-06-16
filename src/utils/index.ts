import * as Cesium from 'cesium'
import { IDomUtil, domUtil } from './domUtil'

class Util {
  private viewer: Cesium.Viewer
  domUtil: IDomUtil
  constructor (viewer: Cesium.Viewer) {
    this.viewer = viewer
    this.domUtil = domUtil
  }

  /**
   * 通过窗口坐标获取三维场景坐标
   * @param windowPosition {x: number, y: number} 窗口坐标
   * @returns {x: number, y: number} 三维场景坐标
   */
  getCoordinationByWindowPosition (windowPosition: { x: number, y: number }): Cesium.Cartesian3 | null {
    if (!windowPosition) return null
    const pickPosition = new Cesium.Cartesian2(windowPosition.x, windowPosition.y)

    const pickObj = this.viewer.scene.pick(pickPosition)
    let isOn3dTiles = false
    let isTerrain = false

    // 拾取3dTiles
    if (pickObj) {
      const beforeDepth = this.viewer.scene.globe.depthTestAgainstTerrain
      this.viewer.scene.globe.depthTestAgainstTerrain = true // 开启深度测试确保pickPosition方法精准

      const cartesian = this.viewer.scene.pickPosition(pickPosition)
      if (cartesian) {
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
        cartographic.height = cartographic.height < 0 ? 0 : cartographic.height

        const cartesianResult = Cesium.Cartesian3.fromDegrees(
          Cesium.Math.toDegrees(cartographic.longitude),
          Cesium.Math.toDegrees(cartographic.latitude),
          cartographic.height,
          Cesium.Ellipsoid.WGS84
        )
        this.viewer.scene.globe.depthTestAgainstTerrain = beforeDepth
        return cartesianResult
      }

      isOn3dTiles =
      pickObj?.primitive instanceof Cesium.Cesium3DTileset ||
      pickObj?.primitive instanceof Cesium.Model ||
      pickObj?.primitive instanceof Cesium.Cesium3DTileFeature
    }

    // 拾取地形
    if (!isOn3dTiles) {
      const ray = this.viewer.camera.getPickRay(pickPosition)
      if (ray) {
        return this.viewer.scene.globe.pick(ray, this.viewer.scene)
      }

      isTerrain = true
    }

    // 拾取椭球体
    if (!isTerrain && !isOn3dTiles) {
      return this.viewer.camera.pickEllipsoid(pickPosition, this.viewer.scene.globe.ellipsoid)
    }

    return null
  }
}
export default Util
