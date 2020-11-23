const commonProperties = require('./common-properties')
const addressLine1 = require('./address-line1')
const addressLine2 = require('./address-line2')
const city = require('./city')
const stateAndZIP = require('./state-and-zip')

module.exports = {
  type: 'container',
  label: 'Mailing address',
  key: 'mailingAddress',
  tableView: true,
  components: [
    {
      type: 'well',
      label: 'Mailing address well (this label will not be shown)',
      key: 'mailingAddressWell',
      tableView: false,
      properties: {
        visible: 'true',
        ...commonProperties('mailingAddressWell', [])
      },
      components: [
        {
          type: 'fieldset',
          legend: 'Mailing address',
          key: 'mailingAddressFieldset',
          tableView: false,
          properties: commonProperties('mailingAddressFieldset', ['legend']),
          components: [
            {
              ...addressLine1,
              validate: {
                required: true
              }
            },
            addressLine2,
            city,
            stateAndZIP
          ]
        }
      ]
    }
  ]
}
