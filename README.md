# formio-sfds
This is a [Form.io] theme for the [SF Design System](https://sfdigitalservices.github.io/sf-design-system/).

👉 See [DEVELOP.md](DEVELOP.md#readme) for development documentation.

## Table of contents
* [Usage](#usage)
* [Custom components](#custom-components)
* [Form options](#form-options)
* [Formio.createForm() improvements](#formiocreateform-improvements)
* [Localization](#localization)
* [Icons](#icons)
* [Declarative actions](#declarative-actions)

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

## Custom components

* `address` fields are rendered as multiple text and number inputs with address
  lines (1 and 2), city, state and zip code.

* Fields with type `state` render an HTML `<select>` input with the 50 U.S.
  states.

* Fields with type `zip` render a ZIP code input field that validates against a
  5-digit number or a ZIP+4 pattern (e.g. `94110-1234`).


## Form options
This theme provides support from additional options by [patching `Formio.createForm()`](#formiocreateform-improvements):

#### `data` option
If provided, the `data` option will be passed along as the form's initial
submission. See also: the [`prefill` option](#prefill-option).

#### `googleTranslate` option
If `googleTranslate` is `false`, the `notranslate` class is added to the
form element wrapper to prevent Google Translate from touching it. This is
preferable (but not required!) when translations are provided via the
`i18n` option, since Google Translate will attempt to translate any element
that _doesn't_ have the `notranslate` class, and may replace a human
translation with a machine translation.

#### `hooks` option
If the `hooks` option is an object, any value that isn't a function is
converted to a [declarative action](#declarative-actions). See formiojs's
[hooks documentation](https://github.com/formio/formio.js/wiki/Form-Renderer#hooks)
for the list of available hooks.

#### `i18n` option
If the `i18n` option is a string, it's treated as a JSON URL from which to
load localizations (translations of form content and field info).

#### `on` option
Like `hooks`, the `on` object can be used to specify [declarative
actions](#declarative-actions) for any of formiojs's
[known form events](https://github.com/formio/formio.js/wiki/Form-Renderer#events).

#### `prefill` option
The `prefill` option allows you to pre-fill form inputs with submission
data:

* The value `querystring` will cause pre-fill values to be parsed from
  `window.location.search`. E.g. `?foo=bar` will initialze the form
  submission as `{foo: 'bar'}`.

* The value `hash` will cause pre-fill values to be parsed from
  `window.location.hash` (afer the leading `#`), so `#foo=bar` will
  initialize the form submission as `{foo: 'bar'}`.

* Otherwise, if `prefill` is an instance of [URLSearchParams], the form
  submission will be initialized using its entries.

#### `formioSFDSOptOut` option
Setting the `formioSFDSOptOut` option to `true` disables all of the
following customizations for your form:

* Scoped style modifications. **Note:** template modifications can't be
  opted out because they're provided at the theme level, so you'll need to
  style the selectors generated by [this theme's template](src/templates),
  not the built-in ones!

* Select components will not be rendered as plain old `<select>` elements
  by default, and the `autocomplete` tag will be ignored.

* Custom [event handlers](#on-option) will not be registered.

* The [`prefill` option](#prefill-option) will be ignored.


## `Formio.createForm()` improvements

* Detects the form rendering language (locale) by looking for the closest
  element with a `lang` attribute.

* Select components are made to always use the `html5` "widget", which is just
  an HTML `<select>` input.

* Form elements are wrapped automatically in `<div class="formio-sfds">`, which
  allows the element itself to receive styles defined in the [scoped CSS](#scoped-css).
  **This behavior can be disabled via the [`formioSFDSOptOut`
  option](#formiosfdsoptout-option).**

* All components get `validateOn: 'blur'`, which defers validation of fields
  until the input is blurred. The default is `change`, which triggers
  validation whenever an input changes, and can trigger disruptive validation
  errors while the user is typing.

## Localization
We use [Phrase] to manage translations of both "generic" form strings and
content specific to each form. There are a couple of different workflows to be
aware of:

### Translate generic strings (content)
1. Translate the strings in the [generic strings Phrase project](https://app.phrase.com/accounts/city-county-of-san-francisco/projects/form-io-generic-strings)
1. Ask somebody with access to this repo to pull the new translations (see below)

### Update generic string translations (engineering)
1. Check out this repo
1. Set `PHRASE_ACCESS_TOKEN` in your local environment
1. Run `script/phrase pull` to get the new strings
1. If `git diff src/i18n` shows a diff, then commit the changes and make a new release

### Translate a form
This workflow is done almost entirely in either [Phrase] or the [Phrase
in-context editor]:

1. Set the `phraseProjectId` custom property of your form on form.io to your
   Phrase project ID
1. Visit `https://formio-sfds.vercel.app/api/strings?formUrl=<URL>`, where
   `<URL>` is your form.io data source URL
1. Save the JSON to your computer
1. Upload the JSON to your Phrase project
1. Log in to sf.gov
1. Visit the form on sf.gov and add `?translate=true` at the end of the URL
1. When the form loads, you should see a modal dialog to log in to Phrase

Once you've logged in, you should see a blue bar across the bottom and pencil
icon markers above each piece of translatable form content:

![Phrase in-context editor screenshot](https://user-images.githubusercontent.com/113896/88839471-f3db8580-d18f-11ea-8121-e0ce158ca274.png)

Each batch of translations can be bundled together in a "release" by adding or
updating the form's `phraseProjectVersion` custom property, ideally using
[semantic versioning conventions](https://semver.org).


## Icons
SFDS icons are rendered with a [selector
observer](https://github.com/josh/selector-observer) to inject SVG icons into
any element with a `data-icon` attribute, as in:

```html
<span data-icon="next" aria-label="Next"></span>
```

See [the source](src/icons/index.js) for a full list of possible `data-icon`
attribute values.

## Declarative actions
The `hooks` and `on` options allow you to customize form behaviors using a
limited vocabulary of "declarative" actions. Each key of these objects is
the name of a hook or event, and its value is an object with a single key
that corresponds to one of the following actions:

* `redirect` takes either a URL string or an object with a `url` key and
  redirects (by setting `window.location`) to the URL. Submission data
  values may be interpolated in the redirect URL as `{key}`, where `key` is
  the API key of the form input. For example:

    ```json
    {
      "on": {
        "submit": {
          "redirect": "/confirm?username={username}"
        }
      }
    }
    ```

* `validateWithService` passes the submission data to an HTTP web service
  for validation. The `url` is the URL of the web service, and may contain
  form value interpolations (e.g. `{username}` expands to
  `form.submission.data.username`), `method` tells it the HTTP verb
  (default: `POST`), and `messages` is an optional object containing custom
  messages for different types of errors, such as
  `{empty: "error message if the response was empty"}`. For instance, you
  might wish to validate a username field via an external service that
  would respond with an error if the provided username is already taken:

    ```json
    {
      "hooks": {
        "beforeSubmit": {
          "validateWithService": {
            "url": "https://some-validation-service.example.com/username/{username}"
          }
        }
      }
    }
    ```

  If the web service fails, _or_ if it's successful and the response JSON
  has an `errors` or `error` key, those are reported as errors and will
  abort `beforeSubmit` hooks.

* `values` validates submissions by comparing the value of the submission
  data with each key in the `values` object. For instance, to ensure that
  the `foo` form input has a value of `"bar"` before submission:

    ```json
    {
      "hooks": {
        "beforeSubmit": {
          "values": {
            "foo": "bar"
          }
        }
      }
    }
    ```


License: [MIT](./LICENSE)

[form.io]: https://form.io
[unpkg]: https://unpkg.com
[URLSearchParams]: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
[Phrase]: https://phrase.com
[Phrase in-context editor]: https://help.phrase.com/help/set-up-in-context-editor
