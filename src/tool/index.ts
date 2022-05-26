import Map from '../index'
class Tool {
  protected viewer: Map
  protected toolType: string

  constructor (toolType: string) {
    this.toolType = toolType
  }

  setViewer (viewer: Map) {
    this.viewer = viewer
  }
}

export default Tool
