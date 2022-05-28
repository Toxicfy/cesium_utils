import * as Cesium from 'cesium'
import Tool from './index'

class DrawTool extends Tool {
  private drawLayer: Cesium.CustomDataSource
  private handler: Cesium.ScreenSpaceEventHandler
  private drawType: string
  private _positionCollection: Cesium.Cartesian3[]

  constructor (drawType: string) {
    super('DRAW_TOOL')
    this.drawLayer = null
    this.handler = null
    this.drawType = drawType || 'Rectangle'
    this._positionCollection = []
  }

  getEntityCollection () {
    return this.drawLayer.entities
  }

  _onLeftClick (ev: Cesium.ScreenSpaceEventHandler.PositionedEvent) {
    const position = this.viewer.scene.pick(ev.position)

    if (position && Cesium.defined(position)) {
      this.viewer.createGeometry.addPoint({
        position,
        layer: this.drawLayer.entities
      })
      this._positionCollection.push(position)

      switch (this.drawType) {
        case 'Point':
          break

          // case 'Polygon': {
          //   const callbackProperty = new Cesium.CallbackProperty(() => {
          //     return new Cesium.PolygonHierarchy(this._positionCollection)
          //   }, false)
          //   break
          // }

        case 'Rectangle': {
          const callbackProperty = new Cesium.CallbackProperty(() => {
            return this._positionCollection
          }, false)
          this.viewer.createGeometry.addRectAngle(
            callbackProperty,
            this.drawLayer.entities
          )
          break
        }
        default:
          break
      }
    }
  }

  _onMouseMove (pos: Cesium.ScreenSpaceEventHandler.MotionEvent) {
    const position = this.viewer.scene.pick(pos.endPosition)
    if (this._positionCollection.length > 0 && Cesium.defined(position)) {
      this._positionCollection.pop()
      this._positionCollection.push(position)
    }
  }

  _onRightClick (pos: Cesium.ScreenSpaceEventHandler.PositionedEvent) {
    // const position =
  }
}
export default DrawTool
