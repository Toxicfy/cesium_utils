import * as Cesium from 'cesium'

class BaseAnalysis {
  protected viewer: Cesium.Viewer

  // eslint-disable-next-line no-useless-constructor
  constructor () {
  }

  setViewer (viewer: Cesium.Viewer) {
    this.viewer = viewer
  }

  // 分析子类自己实现对应的逻辑
  init (viewer: Cesium.Viewer) {
  }
}

export default BaseAnalysis
