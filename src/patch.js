import scrollIntoView from 'scroll-into-view-if-needed'

const wrapperClass = 'formio-sfds'
const PATCHED = `sfds-patch-${Date.now()}`
let util

export default Formio => {
  if (Formio[PATCHED]) {
    return
  }

  util = window.FormioUtils
  patch(Formio)

  Formio[PATCHED] = true
}

function patch (Formio) {
  console.warn('Patching Formio.createForm() with SFDS behaviors...')
  hook(Formio, 'createForm', (createForm, args) => {
    return createForm(...args).then(form => {
      console.info('SFDS form created!')
      form.element.classList.add(wrapperClass, 'd-flex', 'flex-column-reverse', 'mb-4')

      patchScrollOnPageNav(form)

      const model = { ...form.form }
      patchAddressManualMode(model)
      patchSelectMode(model)
      form.form = model

      return form
    })
  })
}

function patchAddressManualMode (model) {
  const addresses = util.searchComponents(model.components, { type: 'address' })
  for (const component of addresses) {
    // FIXME no combination of these seems to make the nested
    // fields render...
    component.mode = 'manual'
    component.enableManualMode = true
    component.manualMode = true
  }
}

function patchSelectMode (model) {
  const selects = util.searchComponents(model.components, { type: 'select' })
  for (const component of selects) {
    component.widget = 'html5'
  }
}

function patchScrollOnPageNav (form) {
  const scrollToForm = () => {
    scrollIntoView(form.element, { behavior: 'smooth' })
  }
  form.on('nextPage', scrollToForm)
  form.on('prevPage', scrollToForm)
}

function hook (obj, methodName, wrapper) {
  const method = obj[methodName].bind(obj)
  obj[methodName] = (...args) => wrapper.call(obj, method, args)
}
