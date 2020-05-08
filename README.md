# formio-sfds
This is a [Form.io] theme for the [SF Design System](https://sfdigitalservices.github.io/sf-design-system/).

👉 See [DEVELOP.md](DEVELOP.md#readme) for development documentation.

## Usage
There are a couple of different ways to use this package in your app:

- [Standalone bundle](#standalone-bundle) (**recommended**)
- [UMD bundle](#umd-bundle)
- [CommonJS](#commonjs) (`require()`)
- [CSS](#css)

### Standalone bundle
**This is the recommended import method.** To use the standalone bundle, add a
single script tag to your document after the one for `formio.js`, e.g.

```html
<script src="https://unpkg.com/formiojs/dist/formio.full.min.js"></script>
<script src="https://unpkg.com/formio-sfds/dist/formio-sfds.standalone.js"></script>
```

The standalone bundle does a bunch of things automatically:

1. Inlines the [CSS](#css) in the `<head>`
2. Calls `Formio.use(FormioSFDS)`
2. Patches `Formio.createForm()` so that any form created from then includes
   [SFDS-specific enhancements](#formiocreateform-improvements)

### CSS
The CSS in this package provides a suite of styles that target a mix of
Form.io-generated selectors, classes used in the custom theme templates, and a
suite of general-purpose utility classes for tweaking individual elements.

#### Scoped CSS
All of the selectors in the packaged CSS are scoped to (nested in) a
`.formio-sfds` class selector, which effectively prevents them from leaking
into the page where the form is embedded.

Unless you're using the [standalone bundle](#standalone-bundle) (which wraps
the form elements automatically), you'll need to wrap all of your the elements
targeted by `Formio.createForm()` with a `<div class="formio-sfds">`.

### UMD bundle
The UMD bundle exports **only** the Formio theme as `FormioSFDS`, and does not
automatically patch `Formio.createForm()`. This may be your best option if
you're working in an environment with multiple forms on a single page, and/or
other Form.io themes.

First, load both the `formiojs` and `formio-sfds` bundles from your CDN of
choice (e.g. [unpkg]) and link to the CSS:

```html
<script src="https://unpkg.com/formiojs/dist/formio.full.min.js"></script>
<script src="https://unpkg.com/formio-sfds/dist/formio-sfds.umd.js"></script>
<link rel="stylesheet" href="https://unpkg.com/formio-sfds/dist/formio-sfds.css">
```

Then, either in a deferred script or on window `load`, tell Form.io to "use" the SFDS theme:

```js
Formio.use(FormioSFDS)
```

You'll need to do this _before_ you call `Formio.createForm()` to ensure that the templates are registered before the form is built.

### CommonJS
If you're using a CommonJS bundler like webpack, browserify, et al:

1. Install both `formiojs` and `formio-sfds` npm packages:

   ```
   npm install formiojs formio-sfds
   ```

2. Import in your app:

    ```js
    const { Formio } = require('formiojs')
    const FormioSFDS = require('formio-sfds')

    Formio.use(FormioSFDS)
    ```

## `Formio.createForm()` improvements

* Select components are made to always use the `html5` "widget", which is just
  an HTML `<select>` input

* Form elements are wrapped automatically in `<div class="formio-sfds">`, which
  allows the element itself to receive styles defined in the [scoped CSS](#scoped-css).

* If `options.googleTranslate === false`, then the `notranslate` class is added
  to the form element wrapper to prevent Google Translate from touching it.

## Custom components

* `address` fields are rendered as multiple text and number inputs with address
  lines (1 and 2), city, state and zip code.

* Fields with type `state` render an HTML `<select>` input with the 50 U.S.
  states.

* Fields with type `zip` render a ZIP code input field that validates against a
  5-digit number or a ZIP+4 pattern (e.g. `94110-1234`).

### Localization
Localization of form field labels and descriptions can be implemented without
having to keep form.io and the English equivalent in sync with string IDs in
the format `{key}_label` (for field labels) and `{key}_description` (for field
descriptions). For example, given this translation spreadsheet:

| String | en | es |
| :--- | :--- | :-- |
| `homeAddress_label` | Home address | Dirección de casa |

...a field with an API key of `homeAddress` will get the spreadsheet
value, _regardless of the label's value in form.io_.

The same rule applies for HTML content components, which can be overridden
using the `{key}_content` string ID.

## Icons
SFDS icons are rendered with a [selector
observer](https://github.com/josh/selector-observer) to inject SVG icons into
any element with a `data-icon` attribute, as in:

```html
<span data-icon="next" aria-label="Next"></span>
```

See [the source](src/icons/index.js) for a full list of possible `data-icon`
attribute values.

License: [MIT](./LICENSE)

[form.io]: https://form.io
[unpkg]: https://unpkg.com
