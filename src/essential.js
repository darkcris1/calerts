function checkProps(prop) {
  if (/^-+/.test(prop)) return prop
  if (/([^\-]+)([A-Z])/g.test(prop))
    return prop.replace(/[A-Z]/g, (x) => '-' + x.toLowerCase())
  return prop.toLowerCase()
}

export function tag(el, option) {
  const newEl = el instanceof Element ? el : document.createElement(el)
  if (!option) return newEl
  for (let key in option) {
    const val = option[key]

    if (/^on([A-Z][a-z A-Z])+/.test(key)) {
      const event = key.toLowerCase().substr(2)
      newEl.addEventListener(event, val)
      continue
    }

    switch (key) {
      case 'style':
        styles(newEl, val)
        break
      case 'appendTo':
        if (!val) break
        val.appendChild(newEl)
        break
      case 'appendChild':
        newEl.appendChild(val)
        break
      case 'dataset':
        newEl.dataset[val[0]] = val[1] || ''
        break
      default:
        newEl[key] = val
    }
  }
  return newEl
}
export function styles(el, option) {
  for (let key in option) {
    el.style.setProperty(checkProps(key), option[key])
  }
}
export function createPromise() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return { reject, resolve, promise }
}
export function queryAll(sel) {
  return document.querySelectorAll(sel)
}
export function edit(el, option) {
  tag(el, option)
  return {
    on: (event, callback, bubble = false) => {
      event.split(' ').forEach((ev) => {
        el.addEventListener(ev, callback, bubble)
      })
    },
  }
}

export function parseArgument(args) {
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
