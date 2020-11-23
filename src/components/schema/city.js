const commonProperties = require('./common-properties')

module.exports = {
  label: 'City',
  type: 'textfield',
  key: 'city',
  input: true,
  validate: {
    required: true
  },
  properties: commonProperties('city')
}
