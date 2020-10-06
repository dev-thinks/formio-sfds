/* eslint-env jest */
import { createForm, destroyForm } from '../lib/test-helpers'
import '../dist/formio-sfds.standalone.js'

const { FormioUtils } = window

const components = [
  { type: 'address' },
  { type: 'button' },
  { type: 'checkbox' },
  {
    type: 'columns',
    columns: [
      {
        width: 3,
        components: [{ type: 'textfield', key: 'left', label: 'Left' }]
      },
      {
        width: 3,
        components: [{ type: 'textfield', key: 'right', label: 'Right' }]
      }
    ]
  },
  { type: 'container' },
  { type: 'day' },
  { type: 'datetime' },
  { type: 'html', tag: 'h1', content: 'Hello, world!' },
  { type: 'number' },
  {
    type: 'radio',
    values: [
      { label: 'One', value: 1 },
      { label: 'Two', value: 2 },
      { label: 'Three', value: 3 }
    ]
  },
  {
    type: 'selectboxes',
    values: [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
      { label: 'C', value: 'c' }
    ]
  },
  { type: 'textfield' },
  {
    type: 'panel',
    components: [
      { type: 'textfield', label: 'Your name' }
    ]
  }
]

describe('component snapshots', () => {
  const scenarios = {
    basic: {},
    required: {
      validate: {
        required: true
      }
    }
  }

  const { getRandomComponentId } = FormioUtils

  for (const comp of components) {
    describe(`component "${comp.type}"`, () => {
      for (const [name, props] of Object.entries(scenarios)) {
        describe(`scenario: ${name}`, () => {
          it('matches the snapshot', async () => {
            let i = 0
            FormioUtils.getRandomComponentId = () => `${comp.type}-${name}-${i++}`

            const form = await createForm({
              components: [
                Object.assign(
                  {
                    label: `This is the ${comp.type} label`,
                    description: `This is the ${comp.type} description`
                  },
                  comp,
                  props
                )
              ]
            })

            form.element.id = `form-${comp.type}-${name}`
            const html = form.element.outerHTML
            expect(html).toMatchSnapshot()

            destroyForm(form)

            FormioUtils.getRandomComponentId = getRandomComponentId
          })
        })
      }
    })
  }
})