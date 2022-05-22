
export interface IDomUtil {
    // 创建 DOM 元素
    createDom (tagName: string, className: string, container: HTMLElement): HTMLElement;
    // 清空 DOM 元素
    clearDom (domElement: HTMLElement): void;
    // 设置 DOM 的内容
    setDomContent (content: string | HTMLElement, container: HTMLElement): HTMLElement;
}

export const domUtil: IDomUtil = {
  createDom (tagName, className, container) {
    const el = document.createElement(tagName)
    el.className = className
    container && container.appendChild(el)
    return el
  },

  clearDom (domElement) {
    while (domElement.hasChildNodes()) {
      domElement.removeChild(domElement.firstChild)
    }
  },

  setDomContent (content, container) {
    if (content && typeof content === 'string') {
      container.innerHTML = content
    } else {
      this.clearDom(container)
      container.appendChild((content as HTMLElement))
    }

    return container
  }
}
