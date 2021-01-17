import * as es from './essential'
import './scss/main.scss'
const { tag, styles, edit, queryAll, createPromise, parseArgument } = es

// Global variables and initial values
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
  const isInput = /text|password|tel|email|number/.test(options.type)
  return tag('input', {
    ...options,
    className: isInput && !options.className ? 'ca-input' : options.className,
    dataset: ['caxyz', key],
  })
}
function cleanUp() {
  const shallowBackdrop = backDrop
  const shallowBoxModal = boxModal
  const transitionSpeed = 150
  shallowBoxModal.style.animation = `ca-out ${transitionSpeed}ms linear forwards`
  shallowBackdrop.style.animation = `ca-fade ${transitionSpeed}ms linear forwards`
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
function calert() {
  cleanUp()
  const config = parseArgument(arguments)
  const { backdropClick = true } = config
  caPromise = createPromise()
  caResolve = caPromise.resolve

  backDrop = tag('div', {
    className: `ca-backdrop`,
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

  tag('img', {
    appendTo: config.image ? boxModal : null,
    ...config.image,
  })
  const sections = {
    icon: tag('div', {
      className: 'ca-icon-section',
      appendTo: config.icon ? boxModal : null,
    }),
    content: tag('div', {
      className: 'ca-content-section',
      appendTo: boxModal,
    }),
    buttons: tag('div', {
      className: 'ca-button-section',
      appendTo: boxModal,
    }),
    footer: tag('footer', {
      appendTo: config.footer ? boxModal : null,
    }),
  }

  const content = {
    title: tag('h2', {
      className: 'ca-title',
      appendTo: config.title ? sections.content : null,
    }),
    text: tag('p', {
      className: 'ca-text',
      appendTo: config.text ? sections.content : null,
    }),
    form: tag('form', {
      className: 'ca-inputs-form',
      appendTo: config.inputs ? sections.content : null,
    }),
  }

  // Initialze all the options
  for (let key in config) {
    const value = config[key]
    switch (key) {
      case 'icon':
        tag('div', {
          className: `ca-icons ca-icons-${value}`,
          appendTo: sections[key],
        })
        break
      case 'footer':
        edit(sections[key], { innerHTML: value, ...value })
        break
      case 'title':
      case 'text':
        edit(content[key], { innerText: value, ...value })
        break
      case 'form':
        edit(content[key], value)
        break
      case 'inputs':
        for (let input in value) {
          content.form.appendChild(defaultInput(input, value[input]))
        }
        break
      case 'cancelButton':
      case 'confirmButton':
        if (!value) break
        sections.buttons.appendChild(defaultButton(key, value))
        break
      case 'modal':
      case 'backdrop':
        const container = key === 'modal' ? boxModal : backDrop
        styles(container, value)
        break
      case 'buttons':
        for (let button in value) {
          sections.buttons.appendChild(defaultButton(button, value[button]))
        }
        break
      case 'iconPosition':
      case 'contentPosition':
      case 'buttonsPosition':
        const position = value.trim()
        const element = sections[key.replace('Position', '')]
        if (position === 'center' || !/right|left/.test(position)) break
        changePosition(element, position)
        break
      case 'preConfirm':
        if (value instanceof Function) value()
      case 'animation':
        edit(boxModal, { style: { animation: value } })
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
