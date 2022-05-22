import * as Cesium from 'cesium'
import { IDomUtil, domUtil } from './domUtil'

class Util {
  private viewer: Cesium.Viewer
  domUtil: IDomUtil
  constructor (viewer: Cesium.Viewer) {
    this.viewer = viewer
    this.domUtil = domUtil
  }

  createDom () {
    return this.domUtil.createDom
  }
}

export default Util
