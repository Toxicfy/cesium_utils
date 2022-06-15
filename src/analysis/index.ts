import * as Cesium from 'cesium'
import Slope from './Slope'
import BaseAnalysis from './BaseAnalysis'

class Analysis {
  private readonly viewer: Cesium.Viewer
  private readonly analysisCollection: Array<BaseAnalysis>

  constructor (viewer) {
    this.viewer = viewer
    this.analysisCollection = []
  }

  // 坡度坡向分析
  get Slope () {
    return Slope
  }

  addAnalysis (analysis: BaseAnalysis) {
    this.analysisCollection.push(analysis)
    analysis.setViewer(this.viewer)
    analysis.init(this.viewer)
  }

  removeAnalysis (analysis: BaseAnalysis) {
    this.analysisCollection.splice(this.analysisCollection.indexOf(analysis), 1)
    analysis.destroy()
  }

  get currentAnalysis (): BaseAnalysis {
    if (this.analysisCollection.length > 0) {
      return this.analysisCollection[this.analysisCollection.length - 1]
    }
  }
}

export default Analysis
