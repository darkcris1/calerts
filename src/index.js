import * as es from './essential'
import './css/main.css'
const { tag, styles, edit, queryAll, createPromise } = es

let caPromise,
  caResolve,
  timer,
  result = {}

let boxModal = tag('_'),
  backDrop = tag('_')

function changePosition(el, position) {
  const isRight = position === 'right'
  styles(el, {
    alignItems: isRight ? 'flex-end' : 'flex-start',
    justifyContent: isRight ? 'flex-end' : 'flex-start',
    textAlign: isRight ? 'right' : 'left',
  })
}
function defaultButton(type, options) {
  const isCancel = type === 'cancelButton'
  const innerText =
    typeof options === 'string' ? options : isCancel ? 'Cancel' : 'OK'
  return tag('button', {
    className: 'ca-btn ca-btn-' + (isCancel ? 'danger' : 'primary'),
    innerText,
    dataset: ['caxyz', type],
    ...options,
  })
}
function defaultInput(key, options) {
  return tag('input', {
    ...options,
    className:
      /text|password|tel|email/.test(options.type) && !options.class
        ? 'ca-input'
        : options.class,
    dataset: ['caxyz', key],
  })
}
function cleanUp() {
  const shallowBackdrop = backDrop
  const shallowBoxModal = boxModal
  const transitionSpeed = 100
  shallowBoxModal.style.animation = `ca-out ${transitionSpeed}ms ease-in-out forwards`
  shallowBackdrop.style.animation = `ca-fade ${transitionSpeed}ms ease-in-out forwards`
  setTimeout(function () {
    shallowBackdrop.remove()
  }, transitionSpeed)
}
function cleanAndResolve() {
  queryAll('input[data-caxyz]').forEach((inp) => {
    result.inputs[inp.dataset.caxyz] = inp.value
  })
  clearTimeout(timer)
  caResolve(result)
  cleanUp()
  result = {}
  caPromise = caResolve = undefined
}
function parseArgument(args) {
  const strParameters = ['title', 'text', 'icon']
  let initialConfig = { confirmButton: true }
  for (let i = 0; i < args.length; i++) {
    const val = args[i]
    if (!(typeof val === 'string')) {
      initialConfig = { ...initialConfig, ...val }
      continue
    }
    initialConfig[strParameters[i]] = args[i]
  }

  return initialConfig
}

function calert() {
  cleanUp()
  const config = parseArgument(arguments)
  const { backdropClick = true } = config
  caPromise = createPromise()
  caResolve = caPromise.resolve

  backDrop = tag('div', {
    className: 'ca-backdrop',
    onClick: function (e) {
      if (e.target !== this || !backdropClick) return
      result.isCanceled = true
      cleanAndResolve()
    },
  })
  boxModal = tag('div', {
    className: 'ca-box',
    appendTo: backDrop,
  })
  if (config.inputs) result.inputs = {}
  if (config.buttons) result.buttons = {}

  const iconSection = tag('div', {
    className: 'ca-icon-section',
    appendTo: config.icon ? boxModal : null,
  })

  tag('img', {
    appendTo: config.image ? boxModal : null,
    ...config.image,
  })
  const contentSection = tag('div', {
    className: 'ca-content-section',
    appendTo: boxModal,
  })
  const titleTag = tag('h2', {
    className: 'ca-title',
    appendTo: config.title ? contentSection : null,
  })
  const textTag = tag('p', {
    className: 'ca-text',
    appendTo: config.text ? contentSection : null,
  })
  const formInputs = tag('form', {
    className: 'ca-inputs-form',
    appendTo: config.inputs ? contentSection : null,
  })
  const buttonSection = tag('div', {
    className: 'ca-button-section',
    appendTo: boxModal,
  })
  const footerSection = tag('footer', {
    appendChild: tag('hr'),
    appendTo: config.footer ? boxModal : null,
  })

  for (let key in config) {
    const value = config[key]
    switch (key) {
      case 'icon':
        tag('div', {
          className: 'ca-icons ca-icons-' + value,
          appendTo: iconSection,
        })
        break
      case 'title':
      case 'text':
        const el = key === 'title' ? titleTag : textTag
        edit(el, { innerText: value, ...value })
        break
      case 'form':
        edit(formInputs, value)
        break
      case 'inputs':
        for (let input in value) {
          formInputs.appendChild(defaultInput(input, value[input]))
        }
        break
      case 'cancelButton':
      case 'confirmButton':
        if (!value) break
        buttonSection.appendChild(defaultButton(key, value))
        break
      case 'footer':
        footerSection.innerHTML += value
        break
      case 'modalBox':
      case 'backdrop':
        const container = key === 'modalBox' ? boxModal : backDrop
        styles(container, value)
        break
      case 'buttons':
        for (let button in value) {
          buttonSection.appendChild(defaultButton(button, value[button]))
        }
        break
      case 'iconPosition':
      case 'contentPosition':
      case 'buttonsPosition':
        const position = value.trim()
        const element =
          key === 'contentPosition'
            ? contentSection
            : key === 'iconPosition'
            ? iconSection
            : buttonSection
        if (position === 'center' || !/right|left/.test(position)) break
        changePosition(element, position)
        break
      case 'preConfirm':
        if (value instanceof Function) value()
    }
  }

  document.body.appendChild(backDrop)

  queryAll('button[data-caxyz]').forEach((btn) => {
    edit(btn).on('click', function () {
      const { caxyz } = this.dataset
      switch (caxyz) {
        case 'cancelButton':
        case 'confirmButton':
          const data = caxyz === 'cancelButton' ? 'isCanceled' : 'isConfirmed'
          result[data] = true
          break
        default:
          result.buttons[caxyz] = true
      }
      cleanAndResolve()
    })
  })
  if (typeof config.timer === 'number')
    timer = setTimeout(cleanAndResolve, config.timer)
  return caPromise.promise
}

calert.utils = es
export default calert
