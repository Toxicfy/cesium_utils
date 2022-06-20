import { uniforms } from './../../lib/Cesium.d'
import * as Cesium from 'cesium'
import Map from './index'
class Snow {
  private viewer: Cesium.Viewer
  private _options: {size?: number, speed?: number}
  private _snowStage: Cesium.PostProcessStage
  constructor (options = {}) {
    const defaultOptions = {
      size: 0.02,
      speed: 60
    }

    this._options = Object.assign({}, defaultOptions, options)
    this._snowStage = null
  }

  init (viewer: Cesium.Viewer) {
    if (!this.viewer) {
      throw new Error('viewer is not defined')
    }
    this.viewer = viewer

    // 后期处理其实是一个叠加修改的过程，通过不同步骤的加工，最后得到想要的结果
    this._snowStage = new Cesium.PostProcessStage({
      name: 'snow',
      fragmentShader: this._getFsShader(),
      uniforms: {
        size: () => this._options.size,
        speed: () => this._options.speed
      }
    })

    viewer.scene.postProcessStages.add(this._snowStage)
  }

  private _getFsShader (): string {
  }

  destroy () {
    if (!this.viewer || !this._snowStage) return
    this.viewer.scene.postProcessStages.remove(this._snowStage)
    this._snowStage.destroy()
    this._options = {}
  }

  get show () {
    if (!this._snowStage) return false
    return this._snowStage.enabled
  }

  set show (visible: boolean) {
    if (!this._snowStage) return
    this._snowStage.enabled = visible
  }
}

export default Snow
