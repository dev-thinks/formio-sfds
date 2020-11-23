const commonProperties = require('./common-properties')
const stateSelect = require('./state-select')
const zipCode = require('./zip-code')

module.exports = {
  type: 'columns',
  key: 'addressStateAndZIP',
  tableView: false,
  properties: commonProperties('addressStateAndZIP'),
  columns: [
    {
      width: 6,
      components: [
        {
          ...stateSelect,
          customClass: 'mb-2 mb-md-0',
          validate: {
            required: true
          }
        }
      ]
    },
    {
      width: 6,
      components: [
        {
          ...zipCode,
          validate: {
            ...zipCode.validate,
            required: true
          }
        }
      ]
    }
  ]
}
