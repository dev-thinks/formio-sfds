const commonProperties = require('./common-properties')

module.exports = {
  label: 'Address line 1',
  key: 'line1',
  type: 'textfield',
  input: true,
  properties: commonProperties('addressLine1'),
  validate: {
    required: true
  }
}
