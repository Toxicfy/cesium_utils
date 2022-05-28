import * as Cesium from 'cesium'
import Map from '../index'

class DrawTool {
  private drawLayer: Cesium.CustomDataSource
  private handler: Cesium.ScreenSpaceEventHandler
  private drawType: string
  private viewer: Map
  private readonly _positionCollection: Cesium.Cartesian3[]

  constructor () {
    this.drawLayer = null
    this.handler = null
    this.drawType = 'Rectangle'
    this._positionCollection = []
  }

  setViewer (viewer: Map) {
    this.viewer = viewer
  }

  _onLeftClick (ev: Cesium.ScreenSpaceEventHandler.PositionedEvent) {
    const position = this.viewer._pickPositionByWindowPosition(ev.position)

    if (position && Cesium.defined(position)) {
      this._positionCollection.push(position)

      switch (this.drawType) {
        case 'Point':{
          this.viewer.createGeometry.addPoint({
            position,
            layer: this.drawLayer.entities
          })
          break
        }

        // case 'Polygon': {
        //   const callbackProperty = new Cesium.CallbackProperty(() => {
        //     return new Cesium.PolygonHierarchy(this._positionCollection)
        //   }, false)
        //   break
        // }

        case 'Rectangle': {
          this._positionCollection.push(position.clone())
          const callbackProperty = new Cesium.CallbackProperty(() => {
            return this._positionCollection
          }, false)
          this.viewer.createGeometry.addRectAngle({
            positions: callbackProperty,
            layer: this.drawLayer.entities
          })
          break
        }
        default:
          break
      }
    }
  }

  _onMouseMove (ev: Cesium.ScreenSpaceEventHandler.MotionEvent) {
    const position = this.viewer._pickPositionByWindowPosition(ev.endPosition)

    if (this._positionCollection.length > 1 && Cesium.defined(position)) {
      this._positionCollection.pop()
      this._positionCollection.push(position)
    }
  }

  _onRightClick () {
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }

  start (type: string) {
    this.drawType = type
    this.drawLayer = new Cesium.CustomDataSource('drawLayer')
    this.viewer.dataSources.add(this.drawLayer)

    !this.handler && (this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas))
    this.handler.setInputAction(this._onLeftClick.bind(this), Cesium.ScreenSpaceEventType.LEFT_CLICK)
    this.handler.setInputAction(this._onMouseMove.bind(this), Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    this.handler.setInputAction(this._onRightClick.bind(this), Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }

  destroy () {
    this.handler && this.handler.destroy()
    this.drawLayer && this.drawLayer.entities.removeAll()
  }
}

export default DrawTool
