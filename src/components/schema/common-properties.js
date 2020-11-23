const pkg = require('../../../package.json')
const t = require('./translations')

const commonProperties = {
  sfdsThemeVersion: pkg.version
}

module.exports = function getCommonProperites (componentId, translateKeys = ['label', 'description']) {
  return {
    sfdsComponentId: componentId,
    ...commonProperties,
    ...t(componentId, translateKeys)
  }
}
