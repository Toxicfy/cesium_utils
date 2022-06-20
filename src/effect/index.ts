import * as Cesium from 'cesium'
import Snow from './snow'

type EffectCollectionTypes = Snow
class Effect {
  private viewer: Cesium.Viewer
  constructor (viewer: Cesium.Viewer) {
    this.viewer = viewer
  }

  addEffect (effect: EffectCollectionTypes) {
    effect.init(this.viewer)
  }
}

export default Effect
