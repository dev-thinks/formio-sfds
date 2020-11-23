const states = require('../../../data/states.json')
const commonProperties = require('./common-properties')

module.exports = {
  label: 'State',
  key: 'state',
  type: 'select',
  widget: 'html5',
  dataSrc: 'values',
  lazyLoad: false,
  input: true,
  template: '{{ item.label }}',
  data: {
    values: states
  },
  properties: commonProperties('state', [
    'label',
    'description',
    ...states.map(item => `values.${item.value}`)
  ])
}
