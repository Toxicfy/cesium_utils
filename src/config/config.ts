export const defaultViewerOptions = {
  animation: false, // 动画小组件
  baseLayerPicker: false, // 底图组件，选择三维数字地球的底图（imagery and terrain）
  fullscreenButton: false, // 全屏组件
  vrButton: false, // VR模式
  geocoder: false, // 地理编码（搜索）组件
  homeButton: false, // 首页，点击之后将视图跳转到默认视角
  infoBox: false, // 信息框
  sceneModePicker: false, // 场景模式，切换2D、3D 和 Columbus View (CV) 模式。
  selectionIndicator: false, // 是否显示选取指示器组件
  timeline: false, // 时间轴
  navigationHelpButton: false, // 帮助提示，如何操作数字地球。
  // 如果最初应该看到导航说明，则为true；如果直到用户明确单击该按钮，则该提示不显示，否则为false。
  navigationInstructionsInitiallyVisible: false
}
