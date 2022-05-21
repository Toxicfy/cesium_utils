const layerType = {
  TILESET_LAYER: 'TILESET_LAYER',
  WMS_LAYER: 'WMS_LAYER',

  // 自定义 type
  createType: (type: string):string => {
    const value = type.toLocaleUpperCase()
    layerType[value] = value
    return value
  }
}

export default layerType
