import * as es from './essential'
import './scss/main.scss'

const { tag, styles, edit, createPromise, parseArgument } = es

// Global variables and initial values
let caPromise,
  caResolve,
  timer,
  result = {},
  boxModal,
  backDrop
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
    onClick: function () {
      switch (type) {
        case 'cancelButton':
        case 'confirmButton':
          const data = type === 'cancelButton' ? 'isCanceled' : 'isConfirmed'
          result[data] = true
          break
        default:
          result.buttons[type] = true
      }
      cleanAndResolve()
    },
  })
}
function defaultInput(key, { value = '', type, className = '', ...props }) {
  const tagName = type === 'textarea' ? type : 'input'
  result.inputs[key] = value
  return tag(tagName, {
    ...props,
    ...(!(type === 'textarea') && { type }),
    value,
    onChange: function () {
      result.inputs[key] = this.value
    },
    className: type === 'range' ? className : `ca-input ${className}`,
  })
}
function cleanUp() {
  // copy the elements so we can access the previous elements
  const shallowBackdrop = backDrop || tag('_')
  const transitionSpeed = 150
  shallowBackdrop.style.animation = `ca-fade ${transitionSpeed}ms ease forwards`
  setTimeout(() => shallowBackdrop.remove(), transitionSpeed)
}
function cleanAndResolve() {
  clearTimeout(timer)
  caResolve(result)
  cleanUp()
  result = {}
  caPromise = caResolve = undefined
}
function calert() {
  cleanUp()
  const config = parseArgument(arguments)
  const {
    backdropClick,
    title,
    text,
    image,
    icon,
    inputs,
    buttons,
    footer,
  } = config

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
  if (inputs) result.inputs = {}
  if (buttons) result.buttons = {}

  tag('img', {
    appendTo: image ? boxModal : null,
    ...image,
  })
  const sections = {
    icon: tag('div', {
      className: 'ca-icon-section',
      appendTo: icon ? boxModal : null,
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
      appendTo: footer ? boxModal : null,
    }),
  }

  const content = {
    title: tag('h2', {
      className: 'ca-title',
      appendTo: title ? sections.content : null,
    }),
    text: tag('p', {
      className: 'ca-text',
      appendTo: text ? sections.content : null,
    }),
    form: tag('form', {
      className: 'ca-inputs-form',
      appendTo: inputs ? sections.content : null,
    }),
  }

  // Initialze all the options
  for (let key in config) {
    const value = config[key]
    switch (key) {
      case 'icon':
        tag('div', {
          className: `ca-icons ca-icons-${value}`,
          appendTo: sections.icon,
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
          if (!value[button]) continue
          sections.buttons.appendChild(defaultButton(button, value[button]))
        }
        break
      case 'iconPosition':
      case 'contentPosition':
      case 'buttonsPosition':
        const element = sections[key.replace('Position', '')]
        if (value === 'center') break
        changePosition(element, value)
        break
      case 'preConfirm':
        if (value instanceof Function) value(boxModal)
      case 'animation':
        boxModal.style.animation = value
    }
  }

  document.body.appendChild(backDrop)

  if (typeof config.timer === 'number')
    timer = setTimeout(cleanAndResolve, config.timer)

  return caPromise.promise
}

calert.utils = es
export default calert
