import { mergeObjects } from '../utils'
import { fallbackCSS, tryParse } from './utils'

const { Event, Formio } = window

const defaultOptions = {
  display: 'form',
  // XXX this should not be required, but it is
  language: 'en'
}

export default class SFGovForm extends window.HTMLElement {
  static get elementName () {
    return 'sfgov-form'
  }

  static register () {
    window.customElements.define(SFGovForm.elementName, SFGovForm)
  }

  constructor () {
    super()
    this.ready = new Promise((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })
    fallbackCSS(this, 'display', 'block')
  }

  get options () {
    const optionString = this.getAttribute('data-options')
    return mergeObjects(
      {},
      defaultOptions,
      optionString ? tryParse(optionString) : {},
      this.otherOptions
    )
  }

  get otherOptions () {
    const prefix = 'option-'
    const options = {}
    for (const key of Object.keys(this.dataset)) {
      if (key.startsWith(prefix)) {
        const value = this.dataset[key]
        options[key.substr(prefix.length)] = tryParse(value) || value
      }
    }
    return options
  }

  get formData () {
    const dataString = this.getAttribute('data-form') || ''
    return tryParse(dataString) || dataString
  }

  connectedCallback () {
    const data = this.formData
    const options = this.options
    Formio.createForm(this, data, options)
      .then(form => {
        this.form = form
        this.dispatchEvent(new Event('form:ready', { form }))
        this._resolve(form)
      })
      .catch(error => {
        this.dispatchEvent(new Event('form:error', { error, data, options }))
        this.innerHTML = `<pre class="bg-red-1 fg-red-4 p-1">${error}</pre>`
        this._reject(error)
      })
  }

  disconnectedCallback () {
    if (this.form) {
      this.form.destroy()
      this.form = null
    }
  }
}