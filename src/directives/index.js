export const imagerror = {
  inserted(dom, options) {
    // 如果没有图片，默认为选项的图片
    dom.src = dom.src || options.value
    dom.onerror = () => {
      dom.src = options.value
    }
  },
  // 组件更新后也要判断
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value
  }
}
