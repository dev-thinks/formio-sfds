/* eslint-env jest */
import { createForm, destroyForm, sleep } from '../lib/test-helpers'

const { Event } = window

// FIXME: we import the built bundle because we aren't (yet)
// telling jest to process our JS with rollup, which is where
// all of the EJS stuff happens.
import '../dist/formio-sfds.standalone.js'

describe('field translations', () => {
  const components = [
    {
      key: 'name',
      type: 'textfield',
      label: 'Name',
      description: 'Please enter your name'
    }
  ]

  it('translates labels', async () => {
    const form = await createForm({
      components
    }, {
      language: 'es',
      i18n: {
        es: {
          'name.label': 'Nombre'
        }
      }
    })

    expect(form.i18next.language).toEqual('es')
    expect(form.t('name.label')).toEqual('Nombre')

    const label = form.element.querySelector('label:not(.control-label--hidden)')
    expect(label.textContent.trim()).toEqual('Nombre')

    destroyForm(form)
  })
})

describe('select options', () => {
  it('translates labels by value', async () => {
    const form = await createForm({
      components: [
        {
          type: 'select',
          key: 'select',
          values: [
            { value: 'hi', label: 'Hi' }
          ]
        }
      ]
    }, {
      language: 'es',
      i18n: {
        es: {
          'select.values.none': 'Nada'
        }
      }
    })

    const select = form.element.querySelector('select')
    select.focus()
    select.dispatchEvent(new Event('change'))
    await sleep(100)

    expect(form.i18next.language).toEqual('es')
    expect(form.t('select.values.none')).toEqual('Nada')

    const option = form.element.querySelector('option')
    expect(option.textContent.trim()).toEqual('Nada')

    destroyForm(form)
  })
})
