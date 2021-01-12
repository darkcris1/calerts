type POSITIONS = 'left' | 'center' | 'right'
type BUTTON = boolean | string | object
interface caConfig {
  text?: string | object
  html?: string | object
  title?: string | object
  footer?: string | object
  form?: object
  timer?: number
  confirmButton?: BUTTON
  cancelButton?: BUTTON
  backdropPostion?: POSITIONS
  iconPosition?: POSITIONS
  contentPosition?: POSITIONS
  modalBox?: object
  backdrop?: object
  preConfirm?: Function
  image?: object
  buttons?: { [key: string]: BUTTON }
  inputs?: { [key: string]: object }
  icon?: 'success' | 'error' | 'info' | 'warning' | 'question'
}

interface result {
  inputs?: object
  buttons?: object
  isCanceled?: boolean
  isConfirmed?: boolean
}

type config = string | caConfig
interface calert {
  (...params: config[]): Promise<result>
  utils: {
    tag: (tag: string | HTMLElement, options?: object) => Node
    styles: (element: HTMLElement, options?: object) => Node
    edit: (element: HTMLElement, options?: object) => any
    queryAll: (selector: string) => NodeList
    createPromise: () => object
  }
}

declare const calert: calert
export default calert
