const { get } = require('dotmap')
const translations = require('../../i18n')
const languages = Object.keys(translations)

module.exports = function t (component, keys) {
  const props = {}
  if (typeof keys === 'string') {
    keys = [...arguments].slice(1)
  }
  for (const lang of languages) {
    for (const key of keys) {
      const stringId = `components.${component}.${key}`
      const translation = get(translations[lang], stringId)
      if (translation) {
        props[`${lang}:${key}`] = translation
      } else {
        console.warn('[%s] missing translation: "%s"', lang, stringId)
      }
    }
  }
  return props
}
