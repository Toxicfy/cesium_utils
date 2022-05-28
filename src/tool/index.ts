import Map from '../index'
import DrawTool from './drawTool'

class Tool {
  protected viewer: Map
  protected toolType: string

  constructor (viewer: Map) {
    this.viewer = viewer
  }

  get DrawTool () {
    return DrawTool
  }

  // TODO: tool的类型还需要补充，当添加新工具时，需要添加对应的类型
  addTool (tool: DrawTool) {
    tool.setViewer(this.viewer)
  }
}

export default Tool
