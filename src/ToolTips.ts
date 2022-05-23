import { domUtil } from './utils/domUtil'

type windowPosition = {
    x: number,
    y: number
}

class ToolTip {
  private _container: HTMLElement
  private _content: string

  constructor () {
    this._createContainer()
    this._content = ''
  }

  _createContainer () {
    this._container = domUtil.createDom('div', 'scene-tooltip', document.body)
    this._container.style.visibility = 'hidden'
  }

  _updatePosition (position: windowPosition) {
    const { x, y } = position
    const adjustY = y - this._container.offsetHeight / 2
    this._container.style.cssText = `
      z-index: 1;
      transform: translate3d(${Math.round(x + 10)}px, ${Math.round(adjustY)}px, 0)
    `
  }

  /**
   * 展示 toolTip
   * @param position 展示位置
   */
  show (position: windowPosition) {
    this._updatePosition(position) // 更新位置
    this._container.style.visibility = 'visible'
  }

  /**
   * 隐藏 toolTip
   */
  hide () {
    this._container && (this._container.style.visibility = 'hidden')
  }

  /**
   * 设置(更新) toolTip 展示内容
   * @param content 内容
   */
  setContent (content) {
    this._content = content
    domUtil.setDomContent(content, this._container)
  }
}

export default ToolTip
