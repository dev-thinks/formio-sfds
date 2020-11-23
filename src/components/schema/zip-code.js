const commonProperties = require('./common-properties')

module.exports = {
  label: 'ZIP code',
  type: 'textfield',
  key: 'zip',
  input: true,
  validate: {
    maxLength: 10,
    pattern: '([0-9]{5}(-[0-9]{4})?)?'
  },
  errors: {
    pattern: 'Please enter a 5-digit <a href="https://en.wikipedia.org/wiki/ZIP_Code">ZIP code</a>'
  },
  properties: commonProperties('zipCode', [
    'label',
    'description',
    'errors.pattern'
  ])
}
