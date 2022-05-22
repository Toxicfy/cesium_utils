import { domUtil } from './utils/domUtil'

type windowPosition = {
    x: number,
    y: number
}

class CreateToolTip {
  private _container: HTMLElement
  constructor () {
    this._create()
  }

  _create () {
    this._container = domUtil.createDom('div', 'scene-tooltip', document.body)
    this._container.style.visibility = 'hidden'
  }

  show (position: windowPosition, content: string) {
    this._updatePosition(position)
    domUtil.setDomContent(content, this._container)
    this._container.style.visibility = 'visible'
    return this
  }

  hide () {
    this._container && (this._container.style.visibility = 'hidden')
  }

  _updatePosition (position: windowPosition) {
    const { x, y } = position
    const adjustY = y - this._container.offsetHeight / 2
    this._container.style.cssText = `
      z-index: 1;
      transform: translate3d(${Math.round(x + 10)}px, ${Math.round(adjustY)}px, 0)
    `
  }
}

export default CreateToolTip
